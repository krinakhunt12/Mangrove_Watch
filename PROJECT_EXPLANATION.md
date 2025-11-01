# Mangrove Watch - Complete Project Explanation

## Project Overview

**Mangrove Watch** is a full-stack AI-powered web application designed for automated monitoring, health assessment, and real-time reporting of mangrove ecosystems. The platform combines cutting-edge AI image classification with satellite-based vegetation analysis to provide comprehensive environmental monitoring tools for researchers, conservationists, and local communities.

---

## Core Problem Statement

Mangrove forests are critical coastal ecosystems that protect shorelines, sequester carbon, and support biodiversity. However, they face constant threats from deforestation, pollution, and climate change. Traditional monitoring methods are:
- Time-consuming and expensive
- Require specialized equipment and expertise
- Limited in coverage and real-time capability

**Solution:** An accessible, AI-powered platform that enables anyone to report and monitor mangrove health using just a smartphone camera.

---

## Technical Architecture

### **Frontend (React.js)**

**Technology Stack:**
- React 18 with functional components and Hooks
- Vite for fast development and optimized builds
- Tailwind CSS for responsive, modern UI design
- Framer Motion for smooth animations
- React Router for navigation

**Key Components:**
1. **Report Page (`Report.jsx`)** - Main feature page with dual input modes
2. **Profile Page** - User dashboard showing submission statistics
3. **Global Bot (`GlobalBot.jsx`)** - AI chatbot interface
4. **Location Bot (`LocationBot.jsx`)** - Location and vegetation analysis interface
5. **Navbar** - Navigation with authentication status

**Key Features Implemented:**
- **Dual Image Input Modes:**
  - **Live Camera Capture:** Real-time photo capture using device camera (`navigator.mediaDevices.getUserMedia`)
  - **File Upload:** Support for uploading pre-captured images
  - Seamless mode switching with state management

- **Geolocation Integration:**
  - Browser Geolocation API (`navigator.geolocation.getCurrentPosition`)
  - Automatic location capture for camera photos
  - Location status indicators with error handling

- **Real-time Feedback:**
  - Toast notifications for user actions
  - Loading states during processing
  - Comprehensive error messages

---

### **Backend (Flask - Python)**

**Technology Stack:**
- Flask for RESTful API endpoints
- SQLite for lightweight database storage
- Google Earth Engine for satellite data analysis
- OpenAI CLIP model for AI image classification

**Core Modules:**

#### 1. **AI Validator (`ai_validator.py`)**
- Implements CLIP (Contrastive Language-Image Pre-training) model
- Classifies images into categories: "healthy mangrove", "mangrove cutting", "dumping/trash", etc.
- Returns confidence scores and classifications
- Loads custom labels from `labels.txt`

#### 2. **Full Pipeline (`full_pipe.py`)**
- Orchestrates the complete analysis workflow
- Coordinates AI classification with EXIF coordinate extraction
- Integrates satellite vegetation analysis
- Manages coordinate source tracking (EXIF, browser, or none)

#### 3. **Satellite Check (`satelite_check.py`)**
- Google Earth Engine integration for NDVI (Normalized Difference Vegetation Index) calculation
- Compares satellite images from 30-60 days ago vs. last 30 days
- Calculates percentage change: `((NDVI_after - NDVI_before) / NDVI_before) * 100`
- Handles cloud cover filtering (<50% clouds)

#### 4. **Utilities (`utils.py`)**
- EXIF GPS coordinate extraction from image metadata
- Helper functions for data processing

#### 5. **Main API (`app.py`)**
- `/run-pipeline` - Main endpoint for image processing
- `/validate` - User authentication verification
- `/user-stats` - User statistics retrieval
- Database integration for storing reports

---

## Key Features & Workflow

### **1. Image Submission Workflow**

#### **Camera Capture Mode:**
```
User clicks "Start Camera" → Browser requests camera permission → 
Video stream displayed → User captures photo → 
Browser geolocation captured → Image sent to backend with coordinates
```

#### **Upload Mode:**
```
User selects image file → File validated (type, size) → 
Image sent to backend → Backend attempts EXIF coordinate extraction →
If EXIF found: Use EXIF coordinates
If EXIF missing: Fall back to browser geolocation (if provided)
If both missing: Show warning, proceed with AI classification only
```

### **2. Backend Processing Pipeline**

```
Image received → Save to uploads folder →
↓
AI Classification (CLIP model) → Get label + confidence →
↓
EXIF Coordinate Extraction → Attempt GPS extraction from image metadata →
↓
If coordinates available:
  → Google Earth Engine satellite analysis →
  → Calculate NDVI change percentage →
  → Return complete result
Else:
  → Check for browser-provided coordinates →
  → If available: Run satellite analysis →
  → Return result with coordinate source flag
```

### **3. Coordinate Priority System**

**Priority Order:**
1. **EXIF Data (Highest Priority)** - GPS coordinates embedded in uploaded images
2. **Browser Geolocation (Fallback)** - User's current location (for camera captures)
3. **None** - No coordinates available, AI classification still performed

**Coordinate Source Tracking:**
- `coordinate_source: "exif"` - Extracted from image metadata
- `coordinate_source: "browser_geolocation"` - From browser geolocation API
- `coordinate_source: "none"` - No coordinates available

---

## Vegetation Change Calculation Explanation

### **Understanding the 298% Result**

The vegetation change percentage is calculated using the formula:
```
Percentage Change = ((NDVI_after - NDVI_before) / NDVI_before) × 100
```

**Example Scenario for 298%:**
- NDVI 60 days ago (before): 0.10 (sparse vegetation)
- NDVI last 30 days (after): 0.398 (dense vegetation)
- Calculation: ((0.398 - 0.10) / 0.10) × 100 = 298%

**This means:**
- The NDVI value nearly **tripled** (3x increase)
- Indicates significant vegetation growth
- Could result from:
  - Seasonal variations (monsoon growth)
  - Mangrove restoration efforts
  - Natural recovery after disturbance
  - Agricultural/planting activities

**Is this normal?**
- Yes, mathematically correct
- High percentages (200-300%+) are possible when comparing very sparse to dense vegetation
- Important to consider context: seasonal changes, restoration projects, or data quality

**Range of Possible Values:**
- **Positive values:** Vegetation increase (growth)
- **Negative values:** Vegetation decrease (deforestation, degradation)
- **Near zero:** Minimal change
- **High positive (>100%):** Significant growth (common after restoration)
- **High negative (<-50%):** Significant loss (deforestation alert)

---

## User Interface Features

### **Report Submission Page:**
- **Mode Toggle:** Switch between camera and upload modes
- **Live Camera Preview:** Real-time video feed with capture button
- **File Upload:** Drag-and-drop or click to upload
- **Location Status:** Shows current location or error message
- **Description Field:** 500-character limit for issue details
- **Real-time Validation:** File type and size checking

### **Response Messages:**
The system provides detailed feedback including:
- ✅ AI classification label (e.g., "Healthy Mangrove", "Mangrove Cutting")
- 📊 Vegetation change percentage
- 📍 Coordinate source indication
- ⚠️ Warnings if EXIF coordinates unavailable
- 🎯 Confidence scores when available

---

## Database Schema

**Table: `workflow_results`**
- `id` - Primary key
- `user_id` - Foreign key to users table
- `confidence` - AI classification confidence (0-1)
- `latitude` - GPS latitude
- `longitude` - GPS longitude
- `label` - AI classification label
- `satellite_vegetation_change` - NDVI change percentage
- `status` - Report status
- `created_at` - Timestamp

---

## Security & Best Practices

1. **File Upload Security:**
   - File type validation (images only)
   - Size limits (5MB max)
   - Secure filename handling

2. **Error Handling:**
   - Camera permission errors
   - Geolocation failures
   - Network errors
   - Invalid file types

3. **User Experience:**
   - Loading indicators
   - Clear error messages
   - Success confirmations
   - Responsive design

---

## Future Enhancements

1. **Advanced AI Models:** Integration of specialized mangrove detection models
2. **Historical Tracking:** Visualize vegetation changes over time
3. **Mobile App:** Native mobile applications for iOS/Android
4. **Real-time Alerts:** Notifications for significant vegetation loss
5. **Community Features:** User comments, collaboration tools
6. **Export Functionality:** Download reports as PDF/CSV
7. **Map Visualization:** Interactive map showing all reported locations

---

## Project Impact

**For Researchers:**
- Automated data collection and analysis
- Large-scale monitoring capabilities
- Quantitative vegetation change metrics

**For Conservationists:**
- Early detection of threats
- Evidence-based decision making
- Community engagement tools

**For Local Communities:**
- Accessible reporting mechanism
- Empowerment to protect local ecosystems
- Educational platform about mangrove importance

---

## Technical Achievements

1. **Seamless Dual Input:** Camera and upload modes with intelligent coordinate handling
2. **Robust Error Handling:** Graceful degradation when coordinates unavailable
3. **Real-time Processing:** Immediate feedback on AI classification and satellite analysis
4. **Scalable Architecture:** Modular design allowing easy feature additions
5. **User-Centric Design:** Intuitive interface with comprehensive feedback

---

## Conclusion

Mangrove Watch represents a significant step forward in democratizing environmental monitoring. By combining accessible technology (smartphone cameras) with powerful AI and satellite analysis, the platform makes mangrove conservation monitoring available to everyone, from researchers to local community members.

The system's intelligent coordinate handling ensures accurate location-based analysis while maintaining flexibility for various use cases. The integration of AI classification with satellite vegetation change analysis provides a comprehensive view of mangrove ecosystem health, enabling timely interventions and informed conservation decisions.

