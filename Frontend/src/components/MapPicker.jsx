import React, { useState, useEffect } from "react";
import { X, Navigation, MapPin } from "lucide-react";

const MapPicker = ({ onLocationSelect, onClose }) => {
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  const initMap = () => {
    if (window.L && !window.mapInstance) {
      // Initialize map
      const map = window.L.map('map').setView([20.5937, 78.9629], 5); // Center of India
      
      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      let marker = null;

      // Add click listener
      map.on('click', (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        
        // Remove previous marker
        if (marker) {
          map.removeLayer(marker);
        }

        // Add new marker
        marker = window.L.marker([lat, lng]).addTo(map);
        setSelectedCoordinates({ lat, lng });
        setLat(lat.toFixed(6));
        setLng(lng.toFixed(6));
      });

      // Store map reference
      window.mapInstance = map;
      window.mapMarker = marker;
    }
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setLat(latitude.toFixed(6));
          setLng(longitude.toFixed(6));
          setSelectedCoordinates({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Could not get your location. Please enter coordinates manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleManualInput = () => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    
    if (isNaN(latitude) || isNaN(longitude)) {
      alert('Please enter valid coordinates.');
      return;
    }
    
    if (latitude < -90 || latitude > 90) {
      alert('Latitude must be between -90 and 90.');
      return;
    }
    
    if (longitude < -180 || longitude > 180) {
      alert('Longitude must be between -180 and 180.');
      return;
    }
    
    setSelectedCoordinates({ lat: latitude, lng: longitude });
  };

  const handleConfirmLocation = () => {
    if (selectedCoordinates) {
      onLocationSelect(`${selectedCoordinates.lat}, ${selectedCoordinates.lng}`);
      onClose();
    }
  };

  const handleQuickSelect = (coordinates) => {
    setSelectedCoordinates(coordinates);
    setLat(coordinates.lat.toFixed(6));
    setLng(coordinates.lng.toFixed(6));
  };

  const handleMapToggle = () => {
    setShowMap(!showMap);
    if (!showMap && mapLoaded) {
      setTimeout(initMap, 100);
    }
  };

  // Popular mangrove locations
  const popularLocations = [
    { name: "Sundarbans, India", lat: 21.9497, lng: 89.1833 },
    { name: "Sundarbans, Bangladesh", lat: 22.1667, lng: 89.2000 },
    { name: "Mumbai Mangroves", lat: 19.0760, lng: 72.8777 },
    { name: "Kerala Backwaters", lat: 9.9312, lng: 76.2673 },
    { name: "Andaman Islands", lat: 11.7401, lng: 92.6586 },
    { name: "Bhitarkanika, Odisha", lat: 20.7500, lng: 86.9000 }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-green-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MapPin size={20} />
            <h3 className="font-semibold">Select Location</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Location */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-3">📍 Use Current Location</h4>
            <button
              onClick={handleGeolocation}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Navigation size={16} />
              <span>Get My Location</span>
            </button>
          </div>

          {/* Live Map */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-3">🗺️ Select from Live Map</h4>
            <button
              onClick={handleMapToggle}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              {showMap ? 'Hide Map' : 'Show Interactive Map'}
            </button>
            
            {showMap && (
              <div className="mt-4">
                <div id="map" className="w-full h-64 rounded-lg border-2 border-purple-200"></div>
                <p className="text-sm text-purple-700 mt-2">
                  Click anywhere on the map to select a location
                </p>
              </div>
            )}
          </div>

          {/* Manual Input */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">📝 Enter Coordinates Manually</h4>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  placeholder="e.g., 19.0760"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  placeholder="e.g., 72.8777"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <button
              onClick={handleManualInput}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Set Coordinates
            </button>
          </div>

          {/* Popular Locations */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-3">🌿 Popular Mangrove Locations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {popularLocations.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSelect(location)}
                  className="text-left p-3 bg-white rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors"
                >
                  <div className="font-medium text-sm">{location.name}</div>
                  <div className="text-xs text-gray-600">
                    {location.lat}, {location.lng}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Location Display */}
          {selectedCoordinates && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">✅ Selected Location</h4>
              <div className="text-sm text-green-800">
                <div>Latitude: {selectedCoordinates.lat}</div>
                <div>Longitude: {selectedCoordinates.lng}</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmLocation}
            disabled={!selectedCoordinates}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapPicker;
