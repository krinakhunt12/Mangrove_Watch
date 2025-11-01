import ee
import datetime
import numpy as np

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


def get_vegetation_change_enhanced(latitude, longitude):
    """
    Enhanced vegetation change analysis with multiple time periods and trend analysis.
    Returns a comprehensive dictionary with:
    - Short-term change (last 30 days)
    - Medium-term change (last 90 days)
    - Long-term change (last 6 months)
    - Trend direction (increasing/decreasing/stable)
    - Alert level (critical/warning/normal)
    - Historical baseline comparison
    """
    if not _initialize_ee():
        print("[WARN] Google Earth Engine not available, returning None")
        return None
    
    try:
        point = ee.Geometry.Point(longitude, latitude)
        area_of_interest = point.buffer(200)  # ~200m buffer
        
        end_date = datetime.datetime.now()
        
        # Define multiple time periods for comprehensive analysis
        periods = {
            "short_term": {
                "before_start": end_date - datetime.timedelta(days=60),
                "before_end": end_date - datetime.timedelta(days=30),
                "after_start": end_date - datetime.timedelta(days=30),
                "after_end": end_date
            },
            "medium_term": {
                "before_start": end_date - datetime.timedelta(days=150),
                "before_end": end_date - datetime.timedelta(days=90),
                "after_start": end_date - datetime.timedelta(days=90),
                "after_end": end_date
            },
            "long_term": {
                "before_start": end_date - datetime.timedelta(days=270),
                "before_end": end_date - datetime.timedelta(days=180),
                "after_start": end_date - datetime.timedelta(days=180),
                "after_end": end_date
            },
            "baseline": {
                "start": end_date - datetime.timedelta(days=365),
                "end": end_date - datetime.timedelta(days=180)
            }
        }
        
        def get_ndvi_collection(start_date, end_date):
            """Get NDVI values from multiple images for statistical robustness"""
            collection = (
                ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
                .filterBounds(area_of_interest)
                .filterDate(start_date.strftime("%Y-%m-%d"), end_date.strftime("%Y-%m-%d"))
                .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 30))  # Stricter cloud filter
            )
            
            if collection.size().getInfo() == 0:
                return None
            
            # Calculate NDVI for all images
            def calculate_ndvi(image):
                return image.normalizedDifference(["B8", "B4"]).rename("NDVI")
            
            ndvi_collection = collection.map(calculate_ndvi)
            
            # Get statistics: mean, median, and std for robustness
            mean_ndvi = ndvi_collection.mean().reduceRegion(
                reducer=ee.Reducer.mean(),
                geometry=area_of_interest,
                scale=10,
                maxPixels=1e9
            ).get("NDVI")
            
            median_ndvi = ndvi_collection.median().reduceRegion(
                reducer=ee.Reducer.median(),
                geometry=area_of_interest,
                scale=10,
                maxPixels=1e9
            ).get("NDVI")
            
            return {
                "mean": mean_ndvi.getInfo() if mean_ndvi else None,
                "median": median_ndvi.getInfo() if median_ndvi else None
            }
        
        results = {}
        
        # Calculate change for each time period
        for period_name, dates in [("short_term", periods["short_term"]), 
                                   ("medium_term", periods["medium_term"]),
                                   ("long_term", periods["long_term"])]:
            before_data = get_ndvi_collection(dates["before_start"], dates["before_end"])
            after_data = get_ndvi_collection(dates["after_start"], dates["after_end"])
            
            if before_data and after_data and before_data["median"] and after_data["median"]:
                # Use median for more robust calculation (less affected by outliers)
                val_before = before_data["median"]
                val_after = after_data["median"]
                
                if val_before > 0:
                    percent_change = ((val_after - val_before) / val_before) * 100
                    results[period_name] = {
                        "change_percent": round(percent_change, 2),
                        "ndvi_before": round(val_before, 4),
                        "ndvi_after": round(val_after, 4)
                    }
                else:
                    results[period_name] = None
            else:
                results[period_name] = None
        
        # Calculate baseline (historical average)
        baseline_data = get_ndvi_collection(periods["baseline"]["start"], periods["baseline"]["end"])
        baseline_ndvi = baseline_data["median"] if baseline_data and baseline_data["median"] else None
        
        # Determine trend direction
        trend_direction = "stable"
        alert_level = "normal"
        
        if results.get("short_term"):
            short_change = results["short_term"]["change_percent"]
            
            # Determine trend
            if short_change > 10:
                trend_direction = "increasing"
            elif short_change < -10:
                trend_direction = "decreasing"
            else:
                trend_direction = "stable"
            
            # Determine alert level
            if short_change < -30:  # Significant loss
                alert_level = "critical"
            elif short_change < -15:  # Moderate loss
                alert_level = "warning"
            elif short_change > 50:  # Unusual growth (might need review)
                alert_level = "warning"
            else:
                alert_level = "normal"
        
        # Compare with baseline if available
        baseline_comparison = None
        if baseline_ndvi and results.get("short_term"):
            current_ndvi = results["short_term"]["ndvi_after"]
            if baseline_ndvi > 0:
                baseline_change = ((current_ndvi - baseline_ndvi) / baseline_ndvi) * 100
                baseline_comparison = {
                    "baseline_ndvi": round(baseline_ndvi, 4),
                    "current_ndvi": round(current_ndvi, 4),
                    "vs_baseline_percent": round(baseline_change, 2)
                }
        
        # Create comprehensive result
        enhanced_result = {
            "short_term_change": results.get("short_term", {}).get("change_percent"),
            "medium_term_change": results.get("medium_term", {}).get("change_percent"),
            "long_term_change": results.get("long_term", {}).get("change_percent"),
            "trend_direction": trend_direction,
            "alert_level": alert_level,
            "baseline_comparison": baseline_comparison,
            "analysis_type": "enhanced_multi_temporal"
        }
        
        # For backward compatibility, include the simple change value
        enhanced_result["vegetation_change"] = results.get("short_term", {}).get("change_percent")
        
        return enhanced_result
        
    except Exception as e:
        print(f"[ERROR] Enhanced GEE analysis failed for ({latitude}, {longitude}): {e}")
        return None


def get_vegetation_change(latitude, longitude, use_enhanced=True):
    """
    Main function to get vegetation change.
    If use_enhanced=True, returns comprehensive analysis.
    If use_enhanced=False, returns simple percentage change for backward compatibility.
    """
    if use_enhanced:
        enhanced_result = get_vegetation_change_enhanced(latitude, longitude)
        if enhanced_result:
            return enhanced_result
        # Fallback to simple method if enhanced fails
        return get_vegetation_change_simple(latitude, longitude)
    else:
        return get_vegetation_change_simple(latitude, longitude)


def get_vegetation_change_simple(latitude, longitude):
    """
    Original simple comparison method (kept for backward compatibility)
    """
    if not _initialize_ee():
        return None
        
    try:
        point = ee.Geometry.Point(longitude, latitude)
        area_of_interest = point.buffer(200)

        end_date = datetime.datetime.now()
        start_date_after = end_date - datetime.timedelta(days=30)
        start_date_before = end_date - datetime.timedelta(days=60)

        def get_best_image(start_date, end_date):
            collection = (
                ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
                .filterBounds(area_of_interest)
                .filterDate(start_date.strftime("%Y-%m-%d"), end_date.strftime("%Y-%m-%d"))
                .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 50))
            )
            if collection.size().getInfo() == 0:
                return None
            return collection.median()

        image_before = get_best_image(start_date_before, start_date_after)
        image_after = get_best_image(start_date_after, end_date)

        if image_before is None or image_after is None:
            return None

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
        print(f"[ERROR] Simple GEE analysis failed: {e}")
        return None


if __name__ == "__main__":
    # Test with dummy coordinates
    lat, lon = 21.1702, 72.8311
    result = get_vegetation_change(lat, lon, use_enhanced=True)
    print(f"Enhanced vegetation analysis at ({lat}, {lon}):")
    print(result)

