// src/pages/Report.jsx
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Report() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedImage || !description) {
      alert("Please upload a photo and add a description.");
      return;
    }
    alert("Report submitted successfully!");
    setSelectedImage(null);
    setDescription("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      <Navbar />

      {/* Hero Section */}
      <header className="text-center py-10 md:py-16 bg-green-100">
        <h1 className="text-3xl md:text-5xl font-bold text-green-900 mb-4">
          Report Mangrove Issue
        </h1>
        <p className="text-base md:text-xl text-green-800 max-w-2xl mx-auto">
          Help us protect mangroves by reporting issues with photos and descriptions.
        </p>
      </header>

      {/* Form Section */}
      <main className="flex-grow container mx-auto py-10 md:py-16">
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-green-200 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center md:space-x-12">
            
            {/* Image Upload */}
            <div className="md:w-1/2 w-full mb-8 md:mb-0">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="rounded-2xl shadow-lg w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-48 md:h-64 border-2 border-dashed border-green-300 rounded-2xl bg-green-50">
                  <p className="text-green-700 mb-2">No image selected</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-4 w-full"
              />
            </div>

            {/* Description */}
            <div className="md:w-1/2 w-full">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue..."
                className="w-full h-32 md:h-48 p-4 rounded-2xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none mb-4"
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 md:px-8 py-3 rounded-2xl shadow-md transition-all text-base md:text-lg"
              >
                Submit Report
              </button>
            </div>

          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-12 px-6 mt-auto">
        <div className="container mx-auto text-center text-green-300">
          <p>© {new Date().getFullYear()} Mangrove Watch. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
