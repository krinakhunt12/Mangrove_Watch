Mangrove Watch 🌳
Mangrove Watch is an AI-powered web platform for the automated monitoring and health assessment of mangrove ecosystems. It provides researchers, conservationists, and policymakers with a powerful tool to analyze aerial and satellite imagery, helping to track deforestation, assess environmental stress, and guide conservation efforts.

▶️ How It Works
The core of Mangrove Watch is a sophisticated two-stage AI pipeline that processes imagery to deliver actionable insights:

Model 1: Mangrove Area Segmentation

When an image is uploaded, it is first processed by a semantic segmentation model (e.g., U-Net).

This model's purpose is to accurately identify and isolate all mangrove areas, creating a "mask" that separates them from water, soil, and other types of vegetation.

Model 2: Mangrove Health Classification

The isolated mangrove regions from the first stage are then fed into a classification model (e.g., a Convolutional Neural Network - CNN).

This model analyzes the mangrove canopy's texture, color, and density to classify its condition into categories such as 'Healthy', 'Stressed', or 'Degraded'.

The final, classified data is then presented to the user on an interactive map for easy visualization.

✨ Features
🔬 AI-Powered Analysis: Leverages a two-stage deep learning pipeline for accurate segmentation and health classification.

🗺️ Interactive Map Interface: Visualizes the results, showing the geographic distribution of mangrove health clearly.

📤 Image Upload & Processing: Allows users to upload their own imagery (e.g., from drones or satellites) for analysis.

📈 Data Dashboard: A user-friendly dashboard to view statistics and track changes over time.

🔐 User Authentication: Secure portal for users to manage their data and analysis history.

🌱 Scalable Architecture: Designed to handle large image files and be extended with more advanced analytical features.

🛠️ Technology Stack
Backend: Python, Flask

Machine Learning / AI: Google Earth Engine, OPENAI clip model

Frontend: React Js, Tailwind CSS

Database (Planned): SQLite or PostgreSQL

🖥️ Usage
Run the Flask application:

# Navigate to your backend directory if app.py is located there
# cd backend/
python app.py

Access the application:
Open your web browser and navigate to http://127.0.0.1:5000.

🔮 Future Scope
Time-Series Analysis: Implement features to compare imagery over different time periods to detect changes.

Direct Data Integration: Connect to satellite data providers like Sentinel Hub or Google Earth Engine via APIs.

Predictive Analytics: Develop models to forecast future degradation risks.

🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Please feel free to fork the repository, create a feature branch, and submit a pull request.
