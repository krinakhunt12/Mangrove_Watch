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
CORS(app, origins=["ttps://mangrove-watch.vercel.app","http://localhost:5173"], supports_credentials=True)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

pipeline = full_pipe.Pipeline()  # <-- Add this line

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "database", "mangrove_watch.db")

def update_user_reports(user_id):
    """Update user total reports count"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            "UPDATE users SET total_reports = total_reports + 1 WHERE id = ?",
            (user_id,)
        )
        conn.commit()
        return True
    except Exception as e:
        print(f"Error updating reports: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()

def get_user_stats(user_id):
    """Get user stats"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            "SELECT total_reports FROM users WHERE id = ?",
            (user_id,)
        )
        result = cursor.fetchone()
        
        if result:
            return {
                "total_reports": result[0]
            }
        return None
    except Exception as e:
        print(f"Error getting user stats: {e}")
        return None
    finally:
        conn.close()

# Health check
@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Backend Flask API is running!"})

# Get user stats
@app.route('/user/stats', methods=['GET'])
def get_stats():
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"status": "error", "message": "user_id is required"}), 400
        
        stats_data = get_user_stats(int(user_id))
        if stats_data:
            return jsonify({"status": "success", "data": stats_data})
        else:
            return jsonify({"status": "error", "message": "User not found"}), 404
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# Get user reports/workflow results
@app.route('/user/reports', methods=['GET'])
def get_user_reports():
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"status": "error", "message": "user_id is required"}), 400
        
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, confidence, latitude, longitude, label, satellite_vegetation_change, 
                   status, created_at
            FROM workflow_results 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT 50
        """, (int(user_id),))
        
        reports = cursor.fetchall()
        conn.close()
        
        reports_data = []
        for row in reports:
            reports_data.append({
                "id": row[0],
                "confidence": row[1],
                "latitude": row[2],
                "longitude": row[3],
                "label": row[4],
                "satellite_vegetation_change": row[5],
                "status": row[6],
                "created_at": row[7]
            })
        
        return jsonify({"status": "success", "data": reports_data})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# Example: Run full pipeline
@app.route("/run-pipeline", methods=["POST"])
def run_pipeline():
    try:
        user_id = None
        description = ""
        
        # Check if request is multipart/form-data (file upload)
        if request.content_type and request.content_type.startswith("multipart/form-data"):
            image_file = request.files.get("image")
            mode = request.form.get("mode")
            description = request.form.get("description", "")
            user_id = request.form.get("user_id")

            if mode == "image":
                if not image_file:
                    return jsonify({"status": "error", "message": "image is required"})
                filename = secure_filename(image_file.filename)
                image_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
                image_file.save(image_path)
                # Pass image_path to pipeline
                result = pipeline.run_on_image(image_path)
                
                # Save result to database and update user stats if user_id is provided
                if user_id:
                    # Save result to database
                    conn = sqlite3.connect(DB_PATH)
                    cursor = conn.cursor()
                    cursor.execute("""
                        INSERT INTO workflow_results 
                        (user_id, confidence, latitude, longitude, label, satellite_vegetation_change, status)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    """, (
                        int(user_id),
                        result.get('confidence'),
                        result.get('latitude'),
                        result.get('longitude'),
                        result.get('label'),
                        result.get('satellite_vegetation_change'),
                        'completed'
                    ))
                    conn.commit()
                    conn.close()
                    
                    # Update user reports count
                    update_user_reports(int(user_id))
                
                return jsonify({"status": "success", "result": result})

            else:
                return jsonify({"status": "error", "message": "Invalid mode for file upload. Use 'image'."})

        # Otherwise, handle JSON as before
        data = request.get_json()
        mode = data.get("mode")
        user_id = data.get("user_id")
        description = data.get("description", "")

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

        # Save result to database and update user stats if user_id is provided
        if user_id:
            # Save result to database
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO workflow_results 
                (user_id, confidence, latitude, longitude, label, satellite_vegetation_change, status)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                int(user_id),
                result.get('confidence'),
                result.get('latitude'),
                result.get('longitude'),
                result.get('label'),
                result.get('satellite_vegetation_change'),
                'completed'
            ))
            conn.commit()
            conn.close()
            
            # Update user reports count
            update_user_reports(int(user_id))

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
        user_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return jsonify({
            "status": "success", 
            "message": "User registered successfully",
            "user_id": user_id,
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
