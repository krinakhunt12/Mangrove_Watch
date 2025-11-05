# NDVI Calculation - How It Works from Satellite Images

## ❌ Common Misconception

**NDVI is NOT calculated from colors (RGB) that we see!**

It's calculated from **spectral bands** - invisible wavelengths of light that satellites can detect.

---

## 🌟 What Are Spectral Bands?

### How Satellites "See" the Earth

Satellites like **Sentinel-2** don't just take regular photos. They capture **multiple wavelengths** of light, including some that are **invisible to human eyes**.

### Visible vs Invisible Light

```
Visible Light Spectrum (what we see):
┌─────────────────────────────────────────┐
│  Red    Orange  Yellow  Green  Blue     │
└─────────────────────────────────────────┘

Invisible Light Spectrum (what satellites see):
┌─────────────────────────────────────────────────────┐
│  UV  |  Visible  |  Near-Infrared  |  Shortwave-IR  │
└─────────────────────────────────────────────────────┘
```

### Sentinel-2 Satellite Bands

The Sentinel-2 satellite captures **13 different spectral bands**:

| Band | Wavelength | Name | What It Measures |
|------|-----------|------|------------------|
| B2 | 490 nm | Blue | Visible blue light |
| B3 | 560 nm | Green | Visible green light |
| **B4** | **665 nm** | **Red** | **Visible red light** |
| B8 | 842 nm | Near-Infrared (NIR) | Invisible infrared light |
| B8A | 865 nm | Narrow NIR | More precise NIR |
| B11 | 1610 nm | Shortwave IR | Water content |
| B12 | 2190 nm | Shortwave IR | Soil moisture |

**For NDVI, we use:**
- **B4 (Red band)** - 665 nanometers (visible red light)
- **B8 (NIR band)** - 842 nanometers (near-infrared, invisible to us)

---

## 🌿 How Vegetation Reflects Light

### The Science Behind NDVI

**Healthy vegetation** has a unique property:

1. **Absorbs Red Light** (for photosynthesis)
   - Chlorophyll (the green pigment in plants) **absorbs** red light
   - This is why plants look green (they reflect green, absorb red)

2. **Reflects Near-Infrared Light** (strongly)
   - The cell structure of healthy leaves **reflects** NIR light very strongly
   - This is invisible to us, but satellites can detect it

### Visual Representation:

```
Sunlight hits a leaf:

┌─────────────────────────────────────────┐
│  Red Light (665 nm)    →  ABSORBED  ❌  │
│  Green Light (560 nm)  →  REFLECTED ✅  │
│  NIR Light (842 nm)    →  STRONGLY      │
│                         REFLECTED ✅✅✅ │
└─────────────────────────────────────────┘
```

### Why This Matters:

- **Healthy vegetation:**
  - Low Red reflectance (absorbs it)
  - High NIR reflectance (strongly reflects it)
  - **Result:** High NDVI value

- **Dead/dry vegetation:**
  - Higher Red reflectance (less absorption)
  - Lower NIR reflectance (weaker reflection)
  - **Result:** Lower NDVI value

- **Bare soil/water:**
  - Similar Red and NIR reflectance
  - **Result:** Low or negative NDVI value

---

## 📊 How NDVI is Calculated

### Step-by-Step Process

**Step 1: Satellite Captures Spectral Bands**

```python
# Sentinel-2 satellite captures:
image = {
    "B4": red_band_data,      # Red reflectance values (0-10000)
    "B8": nir_band_data,      # NIR reflectance values (0-10000)
    # ... other bands ...
}
```

**Step 2: Each Pixel Has Reflectance Values**

For each pixel in the satellite image:
- **B4 (Red):** Contains a reflectance value (how much red light is reflected)
- **B8 (NIR):** Contains a reflectance value (how much NIR light is reflected)

**Example:**
```
Pixel at location (x, y):
- B4 (Red) reflectance: 1500 (low = absorbed by vegetation)
- B8 (NIR) reflectance: 8000 (high = strongly reflected by vegetation)
```

**Step 3: Apply NDVI Formula**

```python
# From your code (satelite_check.py, line 87-88):
def calculate_ndvi(image):
    return image.normalizedDifference(["B8", "B4"]).rename("NDVI")

# This calculates for each pixel:
NDVI = (NIR - Red) / (NIR + Red)
```

**Step 4: Calculate for Example Pixel**

Using the example values above:
```
NDVI = (8000 - 1500) / (8000 + 1500)
     = 6500 / 9500
     = 0.684

This is a HIGH NDVI value (healthy vegetation!)
```

**Step 5: Interpret the Result**

```
NDVI = 0.684

This means:
- NDVI > 0.6 = Dense vegetation (forests) ✅
- This pixel represents healthy vegetation
```

---

## 🔬 Real Example from Your Code

### What Happens in `satelite_check.py`:

**Line 69:** Gets Sentinel-2 satellite data
```python
ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
```

**Line 87-88:** Calculates NDVI
```python
def calculate_ndvi(image):
    return image.normalizedDifference(["B8", "B4"]).rename("NDVI")
```

**What `normalizedDifference(["B8", "B4"])` does:**

For **every pixel** in the image, it calculates:
```python
NDVI_pixel = (B8_pixel - B4_pixel) / (B8_pixel + B4_pixel)
```

**Line 93-95:** Calculates average NDVI for the area
```python
mean_ndvi_before = ndvi_before.reduceRegion(
    reducer=ee.Reducer.mean(),      # Average all pixels
    geometry=area_of_interest,      # In the 200m buffer area
    scale=10,                        # 10m pixel resolution
    maxPixels=1e9
).get("NDVI")
```

This calculates the **average NDVI** for all pixels in the 200-meter radius area around your GPS point.

---

## 📐 Detailed Mathematical Process

### For a Single Pixel:

**Input:**
- B4 (Red) reflectance: `R` (e.g., 1500)
- B8 (NIR) reflectance: `NIR` (e.g., 8000)

**Calculation:**
```
NDVI = (NIR - R) / (NIR + R)
     = (8000 - 1500) / (8000 + 1500)
     = 6500 / 9500
     = 0.684
```

**Why This Formula Works:**

1. **Normalization:** Dividing by (NIR + R) normalizes the result between -1 and +1
2. **Difference:** (NIR - R) captures how much more NIR is reflected than Red
3. **Ratio:** The division creates a ratio that's independent of overall brightness

**Result Interpretation:**
```
NDVI = 0.684

Range: -1 to +1
- -1 to 0: Water, barren land
- 0 to 0.3: Sparse vegetation
- 0.3 to 0.6: Moderate vegetation
- 0.6 to 1.0: Dense vegetation (forests) ← This pixel
```

---

## 🖼️ How Pixels Are Processed

### Satellite Image Structure

A satellite image is a **grid of pixels**:

```
┌─────┬─────┬─────┬─────┐
│ P1  │ P2  │ P3  │ P4  │
├─────┼─────┼─────┼─────┤
│ P5  │ P6  │ P7  │ P8  │
├─────┼─────┼─────┼─────┤
│ P9  │ P10 │ P11 │ P12 │
└─────┴─────┴─────┴─────┘
```

Each pixel has **multiple bands** (layers):

```
Pixel P1:
├── B2 (Blue): 2000
├── B3 (Green): 2500
├── B4 (Red): 1500    ← Used for NDVI
├── B8 (NIR): 8000    ← Used for NDVI
└── ... other bands ...

Pixel P2:
├── B2 (Blue): 1800
├── B3 (Green): 2200
├── B4 (Red): 1400    ← Used for NDVI
├── B8 (NIR): 7500    ← Used for NDVI
└── ... other bands ...
```

### NDVI Calculation for Each Pixel

```python
# For Pixel P1:
NDVI_P1 = (8000 - 1500) / (8000 + 1500) = 0.684

# For Pixel P2:
NDVI_P2 = (7500 - 1400) / (7500 + 1400) = 0.689

# ... and so on for all pixels
```

### Average NDVI for Area

```python
# Your code calculates average:
mean_ndvi = (NDVI_P1 + NDVI_P2 + ... + NDVI_Pn) / n

# Example:
# If area has 100 pixels:
mean_ndvi = (0.684 + 0.689 + ... + 0.650) / 100
          = 0.672
```

---

## 🔍 Why Can't We Use Regular Photos?

### The Problem with RGB Photos

**Regular photos** (from your phone camera) only capture:
- **Red** (R)
- **Green** (G)
- **Blue** (B)

They **cannot** capture:
- **Near-Infrared (NIR)** - This is invisible to regular cameras!

### Comparison:

| Source | Red | Green | Blue | NIR |
|--------|-----|-------|------|-----|
| **Phone Camera** | ✅ | ✅ | ✅ | ❌ |
| **Satellite (Sentinel-2)** | ✅ | ✅ | ✅ | ✅ |

### Why NIR is Essential:

**NDVI formula requires NIR:**
```
NDVI = (NIR - Red) / (NIR + Red)
```

**Without NIR, you can't calculate NDVI!**

That's why your project uses:
1. **AI classification** (CLIP model) on regular photos → Classifies image content
2. **Satellite analysis** (NDVI) on coordinates → Analyzes vegetation health

**They work together:**
- **AI:** "This looks like a healthy mangrove" (from your photo)
- **Satellite:** "The NDVI at this location is 0.72" (from satellite data)

---

## 🛰️ How Your Code Works

### Step-by-Step in `satelite_check.py`:

**1. Get Satellite Data (Line 69)**
```python
collection = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
```
- Accesses Sentinel-2 satellite images
- Each image contains multiple spectral bands (B2, B3, B4, B8, etc.)

**2. Filter Images (Lines 70-72)**
```python
.filterBounds(area_of_interest)      # Location filter
.filterDate(start_date, end_date)   # Date filter
.filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 50))  # Cloud filter
```
- Only gets images for your location
- Only gets images from the date range (last 30 days)
- Filters out cloudy images (>50% clouds)

**3. Select Best Image (Line 76)**
```python
return collection.median()
```
- Takes the **median** of all images in the collection
- Median = more robust than mean (reduces outlier impact)

**4. Calculate NDVI (Lines 87-88)**
```python
def calculate_ndvi(image):
    return image.normalizedDifference(["B8", "B4"]).rename("NDVI")
```
- For each pixel: `NDVI = (B8 - B4) / (B8 + B4)`
- Creates a new NDVI image (one value per pixel)

**5. Get Average NDVI (Lines 93-95)**
```python
mean_ndvi_before = ndvi_before.reduceRegion(
    reducer=ee.Reducer.mean(),
    geometry=area_of_interest,  # 200m radius circle
    scale=10,                     # 10m pixel resolution
    maxPixels=1e9
).get("NDVI")
```
- Calculates average NDVI for all pixels in the 200m buffer area
- Returns a single value (e.g., 0.672)

**6. Calculate Change (Lines 101-108)**
```python
val_before = mean_ndvi_before.getInfo()  # e.g., 0.65
val_after = mean_ndvi_after.getInfo()    # e.g., 0.55

percent_change = ((val_after - val_before) / val_before) * 100
                = ((0.55 - 0.65) / 0.65) * 100
                = -15.38%
```

---

## 📊 Visual Example

### Example: 200m Buffer Area

```
Your GPS Point: (21.17, 72.83)
Area: 200m radius circle

Satellite Image (10m resolution):
┌─────────────────────────────────────┐
│  NDVI = 0.65  │  NDVI = 0.68  │ ... │
├─────────────────────────────────────┤
│  NDVI = 0.72  │  NDVI = 0.64  │ ... │
├─────────────────────────────────────┤
│  NDVI = 0.58  │  NDVI = 0.70  │ ... │
└─────────────────────────────────────┘

Average NDVI = (0.65 + 0.68 + 0.72 + 0.64 + 0.58 + 0.70 + ...) / n
             = 0.672
```

---

## 🔬 Reflectance Values Explained

### What Are Reflectance Values?

**Reflectance** = How much light is reflected (as a percentage or ratio)

**Sentinel-2 stores reflectance as:**
- **Digital Number (DN):** 0 to 10000
- **Or Surface Reflectance:** 0.0 to 1.0 (0% to 100%)

**Example:**
```
Pixel reflectance values:
- B4 (Red): 1500 / 10000 = 15% reflectance
  → This means 15% of red light is reflected, 85% is absorbed

- B8 (NIR): 8000 / 10000 = 80% reflectance
  → This means 80% of NIR light is reflected, 20% is absorbed

This is typical for healthy vegetation:
- Low Red reflectance (absorbs red for photosynthesis)
- High NIR reflectance (reflects NIR strongly)
```

---

## 🎯 Key Takeaways

1. **NDVI is NOT based on color (RGB)**
   - It's based on **spectral bands** (specific wavelengths)

2. **Uses two bands:**
   - **B4 (Red):** Visible red light (665 nm)
   - **B8 (NIR):** Near-infrared light (842 nm) - **invisible to us**

3. **Formula:**
   ```
   NDVI = (NIR - Red) / (NIR + Red)
   ```

4. **Why it works:**
   - Healthy vegetation **absorbs** Red (low reflectance)
   - Healthy vegetation **reflects** NIR (high reflectance)
   - This creates a strong difference → High NDVI

5. **Regular photos can't do this:**
   - They don't capture NIR light
   - That's why satellites are needed for NDVI

6. **Your code:**
   - Gets Sentinel-2 satellite data (with NIR band)
   - Calculates NDVI for each pixel
   - Averages NDVI for the area
   - Compares NDVI over time to detect vegetation change

---

## 📚 Additional Resources

### Sentinel-2 Band Information:
- **B4 (Red):** 665 nm wavelength
- **B8 (NIR):** 842 nm wavelength
- **Resolution:** 10 meters per pixel
- **Revisit time:** Every 5 days

### NDVI Formula:
```
NDVI = (ρ_NIR - ρ_Red) / (ρ_NIR + ρ_Red)

Where:
- ρ_NIR = Near-Infrared reflectance
- ρ_Red = Red reflectance
```

### Why Median Instead of Mean?
- **Median** is more robust against outliers
- If one image has bad data (clouds, shadows), it doesn't skew the result
- Better for noisy satellite data

---

This is how NDVI is calculated from satellite images - it's not about color, but about **light reflectance** at specific wavelengths that we can't see with our eyes, but satellites can detect!

