from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS
import os

def get_gps_coordinates(image_path):
    """
    Extract GPS latitude & longitude from an image's EXIF data.
    Returns [lat, lon] or None if unavailable.
    """
    try:
        image = Image.open(image_path)
        exif_data = image._getexif()
        if not exif_data:
            return None

        gps_info = {}
        for tag, value in exif_data.items():
            tag_name = TAGS.get(tag)
            if tag_name == "GPSInfo":
                for t in value:
                    sub_tag = GPSTAGS.get(t, t)
                    gps_info[sub_tag] = value[t]

        if not gps_info:
            return None

        def convert_to_degrees(value):
            d, m, s = value
            return float(d[0]) / float(d[1]) + \
                   (float(m[0]) / float(m[1]) / 60.0) + \
                   (float(s[0]) / float(s[1]) / 3600.0)

        lat = convert_to_degrees(gps_info["GPSLatitude"])
        if gps_info["GPSLatitudeRef"] != "N":
            lat = -lat

        lon = convert_to_degrees(gps_info["GPSLongitude"])
        if gps_info["GPSLongitudeRef"] != "E":
            lon = -lon

        return [round(lat, 6), round(lon, 6)]

    except Exception:
        return None


# ------------------------------
# Test mode (run directly)
# ------------------------------
if __name__ == "__main__":
    data_folder = "Data"   # your sample images folder
    if not os.path.exists(data_folder):
        print("[ERROR] Data folder not found")
    else:
        for f in os.listdir(data_folder):
            if f.lower().endswith((".jpg", ".jpeg", ".png")):
                path = os.path.join(data_folder, f)
                coords = get_gps_coordinates(path)
                print(f"{f} -> {coords}")
