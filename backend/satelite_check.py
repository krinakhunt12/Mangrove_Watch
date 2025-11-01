import ee
import datetime

# 🔹 Your Google Cloud project ID
PROJECT_ID = "elevated-bonito-470600-h9"

# Global flag to track initialization
_ee_initialized = False

def _initialize_ee():
    """Lazy initialization of Google Earth Engine"""
    global _ee_initialized
    if not _ee_initialized:
        try:
            ee.Initialize(project=PROJECT_ID)
            print("[INFO] Google Earth Engine initialized successfully with project ✅")
            _ee_initialized = True
        except Exception as e:
            print(f"[ERROR] EE Initialization failed: {e}")
            _ee_initialized = False
    return _ee_initialized


def get_vegetation_change(latitude, longitude, use_enhanced=False):
    """
    Compute NDVI change (%) in last 30 days around a GPS point.
    
    Args:
        latitude: GPS latitude
        longitude: GPS longitude  
        use_enhanced: If True, returns comprehensive multi-temporal analysis.
                     If False, returns simple percentage change (default).
    
    Returns:
        - Simple mode: float percentage or None
        - Enhanced mode: dict with short_term_change, medium_term_change, 
                        long_term_change, trend_direction, alert_level, etc.
    """
    # If enhanced mode requested, use enhanced analysis
    if use_enhanced:
        try:
            from enhanced_vegetation_analysis import get_vegetation_change_enhanced
            result = get_vegetation_change_enhanced(latitude, longitude)
            # For backward compatibility, extract simple percentage if available
            if result and isinstance(result, dict):
                return result  # Return full enhanced result
            return result
        except ImportError:
            print("[WARN] Enhanced analysis module not available, falling back to simple method")
        except Exception as e:
            print(f"[WARN] Enhanced analysis failed: {e}, falling back to simple method")
    
    # Initialize EE only when needed
    if not _initialize_ee():
        print("[WARN] Google Earth Engine not available, returning None")
        return None
        
    try:
        point = ee.Geometry.Point(longitude, latitude)
        area_of_interest = point.buffer(200)  # ~200m buffer around point

        end_date = datetime.datetime.now()
        start_date_after = end_date - datetime.timedelta(days=30)
        start_date_before = end_date - datetime.timedelta(days=60)

        # Helper: get best median image in a date range
        def get_best_image(start_date, end_date):
            collection = (
                ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
                .filterBounds(area_of_interest)
                .filterDate(start_date.strftime("%Y-%m-%d"), end_date.strftime("%Y-%m-%d"))
                .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 50))  # allow up to 50% clouds
            )
            if collection.size().getInfo() == 0:
                return None
            return collection.median()

        # Fetch before/after images
        image_before = get_best_image(start_date_before, start_date_after)
        image_after = get_best_image(start_date_after, end_date)

        if image_before is None or image_after is None:
            print("[WARN] No valid satellite images found for this location/date range")
            return None

        # NDVI calculation (B8 = NIR, B4 = Red)
        def calculate_ndvi(image):
            return image.normalizedDifference(["B8", "B4"]).rename("NDVI")

        ndvi_before = calculate_ndvi(image_before)
        ndvi_after = calculate_ndvi(image_after)

        mean_ndvi_before = ndvi_before.reduceRegion(
            reducer=ee.Reducer.mean(), geometry=area_of_interest, scale=10, maxPixels=1e9
        ).get("NDVI")

        mean_ndvi_after = ndvi_after.reduceRegion(
            reducer=ee.Reducer.mean(), geometry=area_of_interest, scale=10, maxPixels=1e9
        ).get("NDVI")

        val_before = mean_ndvi_before.getInfo()
        val_after = mean_ndvi_after.getInfo()

        if val_before is None or val_after is None or val_before == 0:
            return 0.0

        percent_change = ((val_after - val_before) / val_before) * 100
        return round(percent_change, 2)

    except Exception as e:
        print(f"[ERROR] GEE analysis failed for ({latitude}, {longitude}): {e}")
        return None


if __name__ == "__main__":
    # 🔹 Quick test with dummy coordinates
    lat, lon = 21.1702, 72.8311  # Surat, India
    change = get_vegetation_change(lat, lon)
    print(f"Vegetation change at ({lat}, {lon}) = {change}%")
