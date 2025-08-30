# File: /flask-ai-validator/flask-ai-validator/ai_validator.py
import os
import json
import csv
from datetime import datetime
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
from utils import get_gps_coordinates   # helper for GPS extraction


class AIValidator:
    def __init__(self, labels_file="labels.txt", model_name="openai/clip-vit-base-patch32", results_dir="results"):
        # Load labels from labels.txt (fallback to defaults if missing)
        if os.path.exists(labels_file):
            with open(labels_file, "r") as f:
                self.labels = [line.strip() for line in f if line.strip()]
        else:
            print("[WARNING] labels.txt not found. Using default labels.")
            self.labels = ["mangrove cutting", "dumping/trash", "healthy mangrove"]

        # Results folder
        self.results_dir = results_dir
        os.makedirs(self.results_dir, exist_ok=True)

        # Load CLIP model
        self.model = CLIPModel.from_pretrained(model_name)
        self.processor = CLIPProcessor.from_pretrained(model_name)

    def analyze_photo(self, image_path):
        """Run classification on a single photo"""
        image = Image.open(image_path).convert("RGB")
        inputs = self.processor(text=self.labels, images=image, return_tensors="pt", padding=True)
        outputs = self.model(**inputs)

        probs = outputs.logits_per_image.softmax(dim=1)
        confidence, idx = probs.max(dim=1)

        coords = get_gps_coordinates(image_path)  # returns dict or None
        return {
            "label": self.labels[idx],
            "confidence": float(confidence),
            "coordinates": coords
        }

    def analyze_folder(self, folder_path="Data"):
        """Run classification on all images in Data/"""
        results = {}
        for filename in os.listdir(folder_path):
            if filename.lower().endswith((".png", ".jpg", ".jpeg")):
                path = os.path.join(folder_path, filename)
                results[filename] = self.analyze_photo(path)
        return results

    def save_results(self, results):
        """Save results to JSON and CSV"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        json_path = os.path.join(self.results_dir, f"predictions_{timestamp}.json")
        csv_path = os.path.join(self.results_dir, f"predictions_{timestamp}.csv")

        json_list = [
            {
                "filename": k,
                "label": v["label"],
                "confidence": round(v["confidence"], 2),
                "coordinates": v.get("coordinates")
            } for k, v in results.items()
        ]

        with open(json_path, "w") as jf:
            json.dump(json_list, jf, indent=4)

        with open(csv_path, "w", newline="") as cf:
            writer = csv.DictWriter(cf, fieldnames=["filename", "label", "confidence", "coordinates"])
            writer.writeheader()
            writer.writerows(json_list)

        print(f"[INFO] Results saved to:\n - {json_path}\n - {csv_path}")