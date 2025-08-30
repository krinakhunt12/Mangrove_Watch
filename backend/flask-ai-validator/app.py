from flask import Flask, request, jsonify
from ai_validator import AIValidator
import os

app = Flask(__name__)
validator = AIValidator()

@app.route('/analyze', methods=['POST'])
def analyze_images():
    if 'folder_path' not in request.json:
        return jsonify({"error": "folder_path is required"}), 400

    folder_path = request.json['folder_path']
    if not os.path.exists(folder_path):
        return jsonify({"error": "Folder does not exist"}), 404

    results = validator.analyze_folder(folder_path)
    validator.save_results(results)
    return jsonify(results), 200

if __name__ == '__main__':
    app.run(debug=True)