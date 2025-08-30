from flask import Flask, request, jsonify, make_response
import os
import full_pipe  # example import, adjust as per your logic
import ai_validator
import bot_handler
import utils
import satelite_check
from werkzeug.utils import secure_filename
from flask_cors import CORS
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderUnavailable
import time
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3

app = Flask(__name__)

# 2️⃣ Enable CORS after app is defined
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

pipeline = full_pipe.Pipeline()  # <-- Add this line

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "database", "mangrove_watch.db")

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


@app.route("/check_location", methods=["POST"])
def check_location():
    data = request.json
    text = data.get("location", "").strip()
    if not text:
        return jsonify({"error": "No location provided"}), 400

    lat, lon = None, None

    # Case 1: Coordinates provided
    if "," in text:
        try:
            parts = text.split(",")
            lat = float(parts[0].strip())
            lon = float(parts[1].strip())
        except ValueError:
            return jsonify({"error": "Invalid coordinates format. Use: lat, lon"}), 400

    # Case 2: Place name provided
    else:
        geolocator = Nominatim(user_agent="frontend_api")

        def geocode_with_retry(location_name, retries=3, delay=1):
            """Retry geocoding in case of timeout or service unavailable"""
            for attempt in range(retries):
                try:
                    loc = geolocator.geocode(location_name, timeout=10)
                    if loc:
                        return loc.latitude, loc.longitude
                    else:
                        return None, None
                except (GeocoderTimedOut, GeocoderUnavailable):
                    time.sleep(delay)  # wait before retry
            return None, None

        lat, lon = geocode_with_retry(text)
        if lat is None or lon is None:
            return jsonify({"error": "Location not found or geocoding service unavailable"}), 503

    # Run your pipeline
    try:
        result = pipeline.run_on_coordinates(lat, lon)
        veg_change = result.get("satellite_vegetation_change", "N/A")
    except Exception as e:
        return jsonify({"error": f"Pipeline error: {str(e)}"}), 500

    return jsonify({
        "latitude": lat,
        "longitude": lon,
        "vegetation_change": veg_change
    })


@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "")

    if not username or not email or not password:
        return jsonify({"status": "error", "message": "All fields are required"}), 400

    password_hash = generate_password_hash(password)

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
            (username, email, password_hash)
        )
        conn.commit()
        conn.close()
        return jsonify({
            "status": "success", 
            "message": "User registered successfully",
            "username": username,
            "email": email
        })
    except sqlite3.IntegrityError as e:
        conn.close()
        if "username" in str(e):
            return jsonify({"status": "error", "message": "Username already exists"}), 409
        if "email" in str(e):
            return jsonify({"status": "error", "message": "Email already exists"}), 409
        return jsonify({"status": "error", "message": "Database error"}), 500

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username", "").strip()
    password = data.get("password", "")

    if not username or not password:
        return jsonify({"status": "error", "message": "Username and password required"}), 400

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, email, password_hash FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()
    conn.close()

    if user and check_password_hash(user[3], password):
        return jsonify({
            "status": "success", 
            "message": "Login successful", 
            "user_id": user[0],
            "username": user[1],
            "email": user[2]
        })
    else:
        return jsonify({"status": "error", "message": "Invalid username or password"}), 401

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
