import logging
from ai_validator import AIValidator
from satelite_check import get_vegetation_change

# --------------------------
# Logging
# --------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Pipeline:
    def __init__(self):
        self.validator = AIValidator()

    def run_on_folder(self, data_folder="Data"):
        """
        Run full pipeline on a folder of images
        """
        logger.info(f"[PIPELINE] Starting full pipeline on folder {data_folder}...")
        results = self.validator.analyze_folder(data_folder)

        for filename, info in results.items():
            coords = info.get("coordinates")
            if coords and coords[0] is not None and coords[1] is not None:
                lat, lon = coords
                logger.info(f"[PIPELINE] Running satellite check for {filename} at ({lat}, {lon})...")
                veg_change = get_vegetation_change(lat, lon)
                info["satellite_vegetation_change"] = veg_change
            else:
                info["satellite_vegetation_change"] = None

        logger.info("[PIPELINE] Full folder processing completed ✅")
        return results

    def run_on_image(self, image_path):
        """
        Run full pipeline on a single image
        """
        logger.info(f"[PIPELINE] Running pipeline on single image: {image_path}")
        result = self.validator.analyze_photo(image_path)

        coords = result.get("coordinates")
        if coords and coords[0] is not None and coords[1] is not None:
            lat, lon = coords
            logger.info(f"[PIPELINE] Running satellite check for ({lat}, {lon})...")
            veg_change = get_vegetation_change(lat, lon)
            result["satellite_vegetation_change"] = veg_change
        else:
            result["satellite_vegetation_change"] = None

        return result

    def run_on_coordinates(self, lat, lon):
        """
        Run pipeline only on coordinates (no image required)
        """
        logger.info(f"[PIPELINE] Running pipeline on coordinates: ({lat}, {lon})")
        veg_change = get_vegetation_change(lat, lon)

        result = {
            "coordinates": (lat, lon),
            "satellite_vegetation_change": veg_change
        }

        return result


if __name__ == "__main__":
    pipeline = Pipeline()
    test = pipeline.run_on_coordinates(21.17, 72.83)
    print(test)
