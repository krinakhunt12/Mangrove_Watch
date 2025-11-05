# Mangrove Watch - Complete Backend Explanation

## Table of Contents
1. [Backend Architecture Overview](#architecture)
2. [Technology Stack](#tech-stack)
3. [Main Application (app.py)](#main-app)
4. [Core Modules Deep Dive](#core-modules)
5. [Coordinate Extraction Process](#coordinate-extraction)
6. [AI Image Classification](#ai-classification)
7. [Satellite Vegetation Analysis](#satellite-analysis)
8. [Database Operations](#database)
9. [API Endpoints](#api-endpoints)
10. [Complete Workflow Pipeline](#workflow)

---

## 1. Backend Architecture Overview {#architecture}

The backend is built using **Flask** (Python web framework) and follows a modular architecture:

```
backend/
├── app.py                    # Main Flask application & API endpoints
├── full_pipe.py             # Orchestration pipeline
├── ai_validator.py          # AI image classification (CLIP)
├── satelite_check.py        # Satellite vegetation analysis
├── enhanced_vegetation_analysis.py  # Advanced NDVI analysis
├── utils.py                 # GPS coordinate extraction from EXIF
├── bot_handler.py           # Telegram bot integration
├── database/
│   ├── db_setup.py          # Database schema setup
│   └── mangrove_watch.db    # SQLite database
├── uploads/                 # Uploaded images storage
└── results/                 # Analysis results storage
```

**Request Flow:**
```
Frontend Request → Flask API (app.py) → Pipeline (full_pipe.py) 
    → AI Validator (ai_validator.py) + Satellite Check (satelite_check.py)
    → Database Storage → JSON Response
```

---

## 2. Technology Stack {#tech-stack}

### Core Technologies:
- **Flask 3.1.0** - Web framework for REST API
- **Python 3.x** - Programming language
- **SQLite** - Lightweight database
- **Google Earth Engine API** - Satellite data analysis
- **OpenAI CLIP Model** - AI image classification
- **Pillow (PIL)** - Image processing & EXIF extraction
- **Geopy** - Geocoding (location name → coordinates)

### Key Libraries:
- `transformers` - CLIP model loading
- `earthengine-api` - Google Earth Engine integration
- `werkzeug` - Security utilities (password hashing, file handling)
- `flask-cors` - Cross-Origin Resource Sharing

---

## 3. Main Application (app.py) {#main-app}

**File:** `backend/app.py`

This is the **entry point** of the backend. It sets up the Flask server and defines all API endpoints.

### Key Components:

#### A. Application Setup
```python
app = Flask(__name__)
CORS(app, origins=["..."], supports_credentials=True)
```
- Creates Flask application instance
- Enables CORS for frontend communication
- Configures allowed origins (frontend URLs)

#### B. Global Instances
- `validator = AIValidator()` - AI classification instance
- `pipeline = Pipeline()` - Workflow orchestration instance
- `DB_PATH` - SQLite database location

#### C. Configuration
- `UPLOAD_FOLDER = "uploads"` - Where uploaded images are stored
- Creates upload folder if it doesn't exist

---

## 4. Core Modules Deep Dive {#core-modules}

### 4.1 Pipeline Orchestrator (`full_pipe.py`)

**Purpose:** Coordinates the entire analysis workflow, combining AI classification with satellite analysis.

**Key Class:** `Pipeline`

#### Methods:

**1. `run_on_image(image_path)`**
- **Input:** Path to image file
- **Process:**
  1. Calls `ai_validator.analyze_photo()` to classify image
  2. Extracts GPS coordinates from EXIF (via `utils.get_gps_coordinates()`)
  3. If coordinates found → calls `get_vegetation_change()` for satellite analysis
  4. Returns combined result with:
     - AI classification label & confidence
     - GPS coordinates (lat, lon)
     - Coordinate source (exif/browser/none)
     - Satellite vegetation change percentage

**2. `run_on_folder(folder_path)`**
- Processes all images in a folder
- Runs same pipeline for each image
- Returns dictionary of results keyed by filename

**3. `run_on_coordinates(lat, lon)`**
- **Input:** Latitude and longitude
- **Process:** Only runs satellite vegetation analysis (no image needed)
- **Use Case:** When user provides location without image

---

### 4.2 AI Validator (`ai_validator.py`)

**Purpose:** Classifies images using OpenAI's CLIP model to detect mangrove-related conditions.

**Key Class:** `AIValidator`

#### How It Works:

**1. Initialization (`__init__`)**
```python
- Loads labels from labels.txt (or uses defaults)
- Default labels: ["mangrove cutting", "dumping/trash", "healthy mangrove"]
- Sets up results directory for saving predictions
- Model is loaded lazily (only when needed)
```

**2. Model Loading (`load_model()`)**
```python
- Uses Hugging Face transformers library
- Loads: "openai/clip-vit-base-patch32" model
- Loads CLIPProcessor for image preprocessing
- Model is cached after first load (singleton pattern)
```

**3. Image Classification (`analyze_photo()`)**
```python
Process:
1. Opens image with PIL (Pillow) and converts to RGB
2. Preprocesses image + text labels using CLIPProcessor
3. Feeds to CLIP model:
   - Model computes similarity between image and each label
   - Returns logits (scores) for each label
4. Applies softmax to get probabilities
5. Finds label with highest confidence
6. Extracts GPS coordinates from EXIF (via utils.py)
7. Returns:
   {
     "label": "healthy mangrove",  # Best matching label
     "confidence": 0.95,           # Confidence score (0-1)
     "coordinates": [lat, lon]      # GPS coordinates if available
   }
```

**CLIP Model Explanation:**
- CLIP = Contrastive Language-Image Pre-training
- Trained on millions of image-text pairs
- Understands both visual content and text descriptions
- Can match images to text labels semantically
- No need for custom training data (zero-shot classification)

**4. Folder Processing (`analyze_folder()`)**
- Iterates through all images in folder
- Applies `analyze_photo()` to each image
- Returns dictionary: `{filename: result}`

---

### 4.3 Satellite Check (`satelite_check.py`)

**Purpose:** Analyzes vegetation health using Google Earth Engine satellite data (NDVI calculation).

**Key Function:** `get_vegetation_change(latitude, longitude, use_enhanced=False)`

#### How It Works:

**1. Google Earth Engine Initialization**
```python
- Uses Google Cloud project: "elevated-bonito-470600-h9"
- Initializes lazily (only when first called)
- Requires authentication (service account or user credentials)
```

**2. Simple Mode (`use_enhanced=False`)**

**Process:**
```python
1. Creates point geometry at given coordinates
2. Creates 200m buffer around point (area of interest)
3. Defines time periods:
   - Before: 60-30 days ago
   - After: Last 30 days
4. Fetches satellite images:
   - Uses Sentinel-2 collection: "COPERNICUS/S2_SR_HARMONIZED"
   - Filters by:
     * Location (bounds of area)
     * Date range
     * Cloud cover (<50% clouds)
   - Takes median of all images (reduces noise)
5. Calculates NDVI for each period:
   NDVI = (NIR - Red) / (NIR + Red)
   - Uses Band 8 (NIR) and Band 4 (Red)
   - NDVI ranges from -1 to +1
   - Higher NDVI = more vegetation
6. Computes percentage change:
   change% = ((NDVI_after - NDVI_before) / NDVI_before) * 100
7. Returns percentage change (e.g., -15.5% means 15.5% vegetation loss)
```

**3. Enhanced Mode (`use_enhanced=True`)**

Calls `enhanced_vegetation_analysis.py` for comprehensive multi-temporal analysis:

**Time Periods Analyzed:**
- **Short-term:** Last 30 days vs 30-60 days ago
- **Medium-term:** Last 90 days vs 90-150 days ago
- **Long-term:** Last 6 months vs 6-9 months ago
- **Baseline:** Historical average (6-12 months ago)

**Additional Metrics:**
- **Trend Direction:** "increasing", "decreasing", or "stable"
- **Alert Level:** "critical", "warning", or "normal"
  - Critical: >30% loss
  - Warning: 15-30% loss or >50% unusual growth
  - Normal: Otherwise
- **Baseline Comparison:** Current vs historical average

**Returns:**
```python
{
  "short_term_change": -15.5,
  "medium_term_change": -8.2,
  "long_term_change": -12.1,
  "trend_direction": "decreasing",
  "alert_level": "warning",
  "baseline_comparison": {
    "baseline_ndvi": 0.65,
    "current_ndvi": 0.55,
    "vs_baseline_percent": -15.38
  }
}
```

**NDVI Explanation:**
- **NDVI** = Normalized Difference Vegetation Index
- Measures vegetation health using satellite imagery
- Formula: `(NIR - Red) / (NIR + Red)`
- Values:
  - -1 to 0: Water, barren land
  - 0 to 0.3: Sparse vegetation
  - 0.3 to 0.6: Moderate vegetation
  - 0.6 to 1: Dense vegetation (forests)

---

### 4.4 GPS Coordinate Extraction (`utils.py`)

**Purpose:** Extracts GPS coordinates from image EXIF metadata.

**Key Function:** `get_gps_coordinates(image_path)`

#### How It Works:

**1. EXIF Data Extraction**
```python
1. Opens image using PIL (Pillow)
2. Reads EXIF data: image._getexif()
3. EXIF = Exchangeable Image File Format
   - Stores metadata embedded in image files
   - Includes: camera settings, timestamp, GPS coordinates (if available)
```

**2. GPS Info Parsing**
```python
1. Searches EXIF tags for "GPSInfo"
2. Extracts GPS-specific tags:
   - GPSLatitude: [degrees, minutes, seconds]
   - GPSLatitudeRef: "N" or "S"
   - GPSLongitude: [degrees, minutes, seconds]
   - GPSLongitudeRef: "E" or "W"
```

**3. Coordinate Conversion**
```python
GPS coordinates are stored in DMS format (Degrees, Minutes, Seconds):
Example: GPSLatitude = [(37, 1), (46, 1), (0, 1)]
         = 37° 46' 0"

Conversion to decimal degrees:
decimal = degrees + (minutes/60) + (seconds/3600)

Example:
37° 46' 0" = 37 + (46/60) + (0/3600) = 37.7667°

Handles hemisphere:
- If GPSLatitudeRef != "N" → negative latitude
- If GPSLongitudeRef != "E" → negative longitude
```

**4. Returns**
- `[latitude, longitude]` as list of floats (rounded to 6 decimals)
- `None` if no GPS data found

**Example:**
```python
Input: image.jpg (with EXIF GPS data)
Output: [21.170200, 72.831100]  # Surat, India
```

**When GPS Coordinates Are Available:**
- Photos taken with smartphones (if location services enabled)
- Photos taken with GPS-enabled cameras
- Some edited images may lose EXIF data

**Fallback Strategy (in app.py):**
If EXIF extraction fails, the backend checks if frontend provided coordinates via browser geolocation API:
```python
1. Try EXIF extraction first
2. If fails, use browser-provided coordinates (from form data)
3. Mark coordinate source as "exif" or "browser_geolocation"
```

---

## 5. Complete Coordinate Extraction Process {#coordinate-extraction}

This is the **detailed flow** you asked about:

### Step-by-Step Flow:

**1. Image Upload (Frontend → Backend)**
```
Frontend sends multipart/form-data:
- image: File object
- latitude: optional (from browser geolocation)
- longitude: optional (from browser geolocation)
```

**2. File Saving (app.py)**
```python
image_file = request.files.get("image")
filename = secure_filename(image_file.filename)  # Sanitizes filename
image_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
image_file.save(image_path)  # Saves to uploads/ folder
```

**3. Pipeline Execution (full_pipe.py)**
```python
result = pipeline.run_on_image(image_path)
```

**4. AI Classification (ai_validator.py)**
```python
result = validator.analyze_photo(image_path)
# Inside analyze_photo():
coords = get_gps_coordinates(image_path)  # Calls utils.py
```

**5. EXIF Extraction (utils.py)**
```python
def get_gps_coordinates(image_path):
    # Step 1: Open image
    image = Image.open(image_path)
    
    # Step 2: Read EXIF data
    exif_data = image._getexif()
    
    # Step 3: Find GPSInfo tag
    for tag, value in exif_data.items():
        tag_name = TAGS.get(tag)
        if tag_name == "GPSInfo":
            # Extract GPS tags
            for t in value:
                sub_tag = GPSTAGS.get(t, t)
                gps_info[sub_tag] = value[t]
    
    # Step 4: Extract latitude/longitude
    GPSLatitude = gps_info["GPSLatitude"]  # [(37,1), (46,1), (0,1)]
    GPSLatitudeRef = gps_info["GPSLatitudeRef"]  # "N"
    
    # Step 5: Convert DMS to decimal
    def convert_to_degrees(value):
        d, m, s = value
        return float(d[0])/float(d[1]) + \
               (float(m[0])/float(m[1])/60.0) + \
               (float(s[0])/float(s[1])/3600.0)
    
    lat = convert_to_degrees(GPSLatitude)
    if GPSLatitudeRef != "N":
        lat = -lat  # South = negative
    
    # Step 6: Same for longitude...
    lon = convert_to_degrees(GPSLongitude)
    if GPSLongitudeRef != "E":
        lon = -lon  # West = negative
    
    return [round(lat, 6), round(lon, 6)]
```

**6. Fallback to Browser Coordinates (app.py)**
```python
# If EXIF extraction failed but browser provided coordinates:
if (provided_lat and provided_lon and 
    not result.get("coordinates")):
    result["latitude"] = float(provided_lat)
    result["longitude"] = float(provided_lon)
    result["coordinate_source"] = "browser_geolocation"
    # Now run satellite analysis with these coordinates
    veg_change = get_vegetation_change(lat, lon)
```

**7. Final Result**
```python
{
  "label": "healthy mangrove",
  "confidence": 0.92,
  "coordinates": [21.170200, 72.831100],
  "latitude": 21.170200,
  "longitude": 72.831100,
  "coordinate_source": "exif",  # or "browser_geolocation" or "none"
  "satellite_vegetation_change": -15.5
}
```

---

## 6. AI Image Classification Process {#ai-classification}

### Complete Flow:

**1. Image Preprocessing**
```python
image = Image.open(image_path).convert("RGB")
# Converts to RGB to ensure consistent format
```

**2. CLIP Processing**
```python
inputs = processor(
    text=self.labels,           # ["mangrove cutting", "dumping/trash", "healthy mangrove"]
    images=image,               # PIL Image object
    return_tensors="pt",        # PyTorch tensors
    padding=True
)
```

**3. Model Inference**
```python
outputs = self.model(**inputs)
# Model computes:
# - Image embeddings (visual representation)
# - Text embeddings (label representations)
# - Similarity scores between image and each label
```

**4. Probability Calculation**
```python
probs = outputs.logits_per_image.softmax(dim=1)
# softmax converts raw scores to probabilities (sum = 1.0)
# Example: [0.05, 0.03, 0.92] → 92% confidence for "healthy mangrove"
```

**5. Best Match Selection**
```python
confidence, idx = probs.max(dim=1)
# idx = index of highest probability
# confidence = probability value
# label = self.labels[idx]
```

**6. Result Assembly**
```python
return {
    "label": "healthy mangrove",
    "confidence": 0.92,
    "coordinates": [lat, lon]  # From EXIF extraction
}
```

---

## 7. Satellite Vegetation Analysis Process {#satellite-analysis}

### Complete Flow:

**1. Google Earth Engine Setup**
```python
ee.Initialize(project=PROJECT_ID)
# Authenticates with Google Cloud
# Requires service account or user credentials
```

**2. Geometry Creation**
```python
point = ee.Geometry.Point(longitude, latitude)
area_of_interest = point.buffer(200)  # 200m radius circle
```

**3. Date Range Definition**
```python
end_date = datetime.now()
start_date_after = end_date - timedelta(days=30)   # Last 30 days
start_date_before = end_date - timedelta(days=60)  # 30-60 days ago
```

**4. Satellite Image Collection**
```python
collection = (
    ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")  # Sentinel-2 satellite
    .filterBounds(area_of_interest)                   # Location filter
    .filterDate(start_date, end_date)                # Date filter
    .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 50))  # Cloud filter
)
```

**5. Image Selection**
```python
# Takes median of all images in collection
# Median = robust against outliers (better than mean)
image = collection.median()
```

**6. NDVI Calculation**
```python
def calculate_ndvi(image):
    # B8 = Near-Infrared band (reflects vegetation strongly)
    # B4 = Red band (absorbed by vegetation)
    ndvi = image.normalizedDifference(["B8", "B4"])
    return ndvi.rename("NDVI")

ndvi_before = calculate_ndvi(image_before)
ndvi_after = calculate_ndvi(image_after)
```

**7. Regional Statistics**
```python
mean_ndvi_before = ndvi_before.reduceRegion(
    reducer=ee.Reducer.mean(),      # Average NDVI in area
    geometry=area_of_interest,      # 200m buffer
    scale=10,                        # 10m pixel resolution
    maxPixels=1e9                    # Maximum pixels to process
).get("NDVI")
```

**8. Percentage Change Calculation**
```python
val_before = mean_ndvi_before.getInfo()  # e.g., 0.65
val_after = mean_ndvi_after.getInfo()    # e.g., 0.55

percent_change = ((val_after - val_before) / val_before) * 100
# = ((0.55 - 0.65) / 0.65) * 100 = -15.38%
```

**9. Result**
```python
return round(percent_change, 2)  # -15.38
# Negative = vegetation loss
# Positive = vegetation gain
```

---

## 8. Database Operations {#database}

### Database Schema (`database/db_setup.py`)

**Tables:**

**1. `users` Table**
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    total_reports INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**2. `workflow_results` Table**
```sql
CREATE TABLE workflow_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    confidence REAL,
    latitude REAL,
    longitude REAL,
    label TEXT,
    satellite_vegetation_change TEXT,
    status TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

### Database Functions in `app.py`:

**1. `update_user_reports(user_id)`**
- Increments `total_reports` count for user
- Called after each successful report submission

**2. `get_user_stats(user_id)`**
- Returns total number of reports submitted by user
- Used in profile page

**3. Report Storage**
```python
cursor.execute("""
    INSERT INTO workflow_results 
    (user_id, confidence, latitude, longitude, label, 
     satellite_vegetation_change, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
""", (user_id, confidence, lat, lon, label, veg_change, 'completed'))
```

**4. Report Retrieval**
```python
# Get user's last 50 reports
SELECT id, confidence, latitude, longitude, label, 
       satellite_vegetation_change, status, created_at
FROM workflow_results 
WHERE user_id = ? 
ORDER BY created_at DESC 
LIMIT 50
```

---

## 9. API Endpoints {#api-endpoints}

### All Endpoints Defined in `app.py`:

**1. `GET /`**
- Health check endpoint
- Returns: `{"message": "Backend Flask API is running!"}`

**2. `POST /run-pipeline`**
- **Main endpoint for image analysis**
- **Request Types:**
  - `multipart/form-data` (file upload):
    - `image`: File
    - `mode`: "image"
    - `latitude`: optional (float)
    - `longitude`: optional (float)
    - `user_id`: optional (int)
    - `description`: optional (string)
  - `application/json`:
    - `mode`: "image" | "folder" | "coordinates"
    - For "image": `image_path`: string
    - For "coordinates": `lat`: float, `lon`: float
    - `user_id`: optional
- **Response:**
  ```json
  {
    "status": "success",
    "result": {
      "label": "healthy mangrove",
      "confidence": 0.92,
      "latitude": 21.170200,
      "longitude": 72.831100,
      "coordinate_source": "exif",
      "satellite_vegetation_change": -15.5
    }
  }
  ```

**3. `POST /validate`**
- **AI classification only** (no satellite analysis)
- Request:
  ```json
  {
    "mode": "image" | "folder",
    "image_path": "path/to/image.jpg"
  }
  ```
- Response: Classification result only

**4. `POST /satellite-check`**
- **Satellite analysis only** (no AI classification)
- Request:
  ```json
  {
    "lat": 21.170200,
    "lon": 72.831100
  }
  ```
- Response: Vegetation change percentage

**5. `POST /check_location`**
- **Location-based analysis** (accepts place name or coordinates)
- Request:
  ```json
  {
    "location": "Ahmedabad"  // or "21.17, 72.83"
  }
  ```
- Process:
  1. If coordinates → use directly
  2. If place name → geocode using Nominatim (OpenStreetMap)
  3. Run pipeline on coordinates
- Response: Vegetation change data

**6. `POST /signup`**
- **User registration**
- Request:
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "secure_password"
  }
  ```
- Process:
  1. Validates all fields present
  2. Hashes password using `generate_password_hash()`
  3. Inserts into `users` table
- Response:
  ```json
  {
    "status": "success",
    "user_id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
  ```

**7. `POST /login`**
- **User authentication**
- Request:
  ```json
  {
    "username": "john_doe",
    "password": "secure_password"
  }
  ```
- Process:
  1. Queries database for user
  2. Verifies password using `check_password_hash()`
  3. Returns user data if valid
- Response:
  ```json
  {
    "status": "success",
    "user_id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
  ```

**8. `GET /user/stats`**
- **Get user statistics**
- Query params: `?user_id=1`
- Response:
  ```json
  {
    "status": "success",
    "data": {
      "total_reports": 15
    }
  }
  ```

**9. `GET /user/reports`**
- **Get user's report history**
- Query params: `?user_id=1`
- Response:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 1,
        "confidence": 0.92,
        "latitude": 21.170200,
        "longitude": 72.831100,
        "label": "healthy mangrove",
        "satellite_vegetation_change": "-15.5",
        "status": "completed",
        "created_at": "2024-01-15 10:30:00"
      }
    ]
  }
  ```

---

## 10. Complete Workflow Pipeline {#workflow}

### End-to-End Flow When User Submits Image:

**Step 1: Frontend Upload**
```
User captures/selects image → Frontend sends multipart/form-data:
- image: File
- latitude: 21.170200 (from browser geolocation)
- longitude: 72.831100
- user_id: 1
```

**Step 2: Flask Receives Request (`app.py`)**
```python
@app.route("/run-pipeline", methods=["POST"])
def run_pipeline():
    # Extract file and form data
    image_file = request.files.get("image")
    provided_lat = request.form.get("latitude")
    provided_lon = request.form.get("longitude")
    user_id = request.form.get("user_id")
```

**Step 3: File Saving**
```python
filename = secure_filename(image_file.filename)
image_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
image_file.save(image_path)  # Saves to uploads/ folder
```

**Step 4: Pipeline Execution**
```python
result = pipeline.run_on_image(image_path)
```

**Step 5: Inside Pipeline (`full_pipe.py`)**
```python
def run_on_image(image_path):
    # Step 5a: AI Classification
    result = self.validator.analyze_photo(image_path)
    # Inside analyze_photo():
    # - Loads CLIP model (if not loaded)
    # - Preprocesses image
    # - Runs classification
    # - Extracts EXIF coordinates (via utils.py)
    # Returns: {label, confidence, coordinates}
    
    # Step 5b: Coordinate Handling
    coords = result.get("coordinates")
    if coords and coords[0] and coords[1]:
        lat, lon = coords[0], coords[1]
        result["coordinate_source"] = "exif"
        
        # Step 5c: Satellite Analysis
        veg_change = get_vegetation_change(lat, lon)
        result["satellite_vegetation_change"] = veg_change
    else:
        result["coordinate_source"] = "none"
        result["satellite_vegetation_change"] = None
```

**Step 6: Fallback to Browser Coordinates (if EXIF failed)**
```python
if (provided_lat and provided_lon and 
    not result.get("coordinates")):
    result["latitude"] = float(provided_lat)
    result["longitude"] = float(provided_lon)
    result["coordinate_source"] = "browser_geolocation"
    veg_change = get_vegetation_change(lat, lon)
    result["satellite_vegetation_change"] = veg_change
```

**Step 7: Database Storage**
```python
if user_id:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO workflow_results 
        (user_id, confidence, latitude, longitude, label, 
         satellite_vegetation_change, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (user_id, confidence, lat, lon, label, veg_change, 'completed'))
    conn.commit()
    
    # Update user's report count
    update_user_reports(user_id)
```

**Step 8: Response**
```python
return jsonify({
    "status": "success",
    "result": {
        "label": "healthy mangrove",
        "confidence": 0.92,
        "latitude": 21.170200,
        "longitude": 72.831100,
        "coordinate_source": "exif",
        "satellite_vegetation_change": -15.5
    }
})
```

**Step 9: Frontend Receives Response**
- Displays classification result
- Shows confidence score
- Displays vegetation change percentage
- Shows location on map (if coordinates available)

---

## 11. Additional Features

### Telegram Bot Integration (`bot_handler.py`)

**Purpose:** Allows users to interact via Telegram bot

**Features:**
- `/start` - Welcome message
- Text input - Accepts location name or coordinates
- Geocoding - Converts place names to coordinates
- Satellite analysis - Returns vegetation change

**Flow:**
```
User sends: "Ahmedabad"
→ Bot geocodes to coordinates
→ Calls pipeline.run_on_coordinates()
→ Returns vegetation change
→ Bot sends result to user
```

---

## 12. Error Handling

### Common Error Scenarios:

**1. No GPS Coordinates in Image**
- Falls back to browser coordinates
- If none provided → marks as "none"
- Still runs AI classification

**2. Google Earth Engine Failure**
- Returns `None` for satellite analysis
- AI classification still works

**3. Invalid Image Format**
- Pillow handles format conversion
- Returns error if unsupported format

**4. Database Errors**
- Uses try/except blocks
- Rolls back transactions on error
- Returns error JSON to frontend

---

## 13. Security Features

**1. Password Hashing**
- Uses Werkzeug's `generate_password_hash()`
- Uses PBKDF2 algorithm
- Never stores plaintext passwords

**2. File Upload Security**
- Uses `secure_filename()` to sanitize filenames
- Prevents path traversal attacks

**3. SQL Injection Prevention**
- Uses parameterized queries (`?` placeholders)
- Never concatenates user input into SQL

**4. CORS Configuration**
- Restricts allowed origins
- Prevents unauthorized cross-origin requests

---

## Summary

The backend is a **Flask-based REST API** that:

1. **Receives images** from frontend
2. **Extracts GPS coordinates** from EXIF metadata (or browser geolocation)
3. **Classifies images** using OpenAI CLIP model
4. **Analyzes vegetation** using Google Earth Engine satellite data
5. **Stores results** in SQLite database
6. **Returns comprehensive analysis** to frontend

**Key Technologies:**
- **Flask** - Web framework
- **CLIP** - AI image classification
- **Google Earth Engine** - Satellite analysis
- **PIL/Pillow** - Image & EXIF processing
- **SQLite** - Database storage

**Workflow:**
```
Image Upload → EXIF Extraction → AI Classification → Satellite Analysis → Database Storage → JSON Response
```

This architecture enables **real-time mangrove monitoring** using just a smartphone camera and satellite data!

