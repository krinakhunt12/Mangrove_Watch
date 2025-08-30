from flask import Flask, request, jsonify
import os
import full_pipe  # example import, adjust as per your logic
import ai_validator
import bot_handler
import utils
import satelite_check
from werkzeug.utils import secure_filename

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Health check
@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Backend Flask API is running!"})


# Example: Run full pipeline
@app.route("/run-pipeline", methods=["POST"])
def run_pipeline():
    try:
        # Check if request is multipart/form-data (file upload)
        if request.content_type and request.content_type.startswith("multipart/form-data"):
            image_file = request.files.get("image")
            mode = request.form.get("mode")
            description = request.form.get("description", "")

            if mode == "image":
                if not image_file:
                    return jsonify({"status": "error", "message": "image is required"})
                filename = secure_filename(image_file.filename)
                image_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
                image_file.save(image_path)
                # Pass image_path to pipeline
                result = pipeline.run_on_image(image_path)
                # Optionally, you can save description or handle it as needed
                return jsonify({"status": "success", "result": result})

            else:
                return jsonify({"status": "error", "message": "Invalid mode for file upload. Use 'image'."})

        # Otherwise, handle JSON as before
        data = request.get_json()
        mode = data.get("mode")

        if mode == "folder":
            folder = data.get("folder", "Data")
            result = pipeline.run_on_folder(folder)
        
        elif mode == "image":
            image_path = data.get("image_path")
            if not image_path:
                return jsonify({"status": "error", "message": "image_path is required"})
            result = pipeline.run_on_image(image_path)

        elif mode == "coordinates":
            lat = data.get("lat")
            lon = data.get("lon")
            if lat is None or lon is None:
                return jsonify({"status": "error", "message": "lat and lon are required"})
            result = pipeline.run_on_coordinates(lat, lon)

        else:
            return jsonify({"status": "error", "message": "Invalid mode. Use 'folder', 'image', or 'coordinates'"})

        return jsonify({"status": "success", "result": result})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})



# Example: Validate AI predictions
@app.route('/validate', methods=['POST'])
def validate():
    try:
        data = request.get_json()

        mode = data.get("mode", "image")  # default = image
        result = None

        if mode == "image":
            image_path = data.get("image_path")
            if not image_path:
                return jsonify({"status": "error", "message": "image_path is required"})
            result = validator.analyze_photo(image_path)

        elif mode == "folder":
            folder_path = data.get("folder_path", "Data")
            result = validator.analyze_folder(folder_path)

        else:
            return jsonify({"status": "error", "message": "Invalid mode. Use 'image' or 'folder'"})

        return jsonify({"status": "success", "result": result})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})



# Example: Satellite check
@app.route("/satellite-check", methods=["POST"])
def satellite_check():
    try:
        data = request.get_json()
        lat = data.get("lat")
        lon = data.get("lon")

        if lat is None or lon is None:
            return jsonify({"status": "error", "message": "lat and lon are required"})

        result = get_vegetation_change(lat, lon)
        return jsonify({
            "status": "success",
            "coordinates": {"lat": lat, "lon": lon},
            "vegetation_change_percent": result
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
