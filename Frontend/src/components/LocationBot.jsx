import React, { useState } from "react";
import { MapPin, Send, X, Bot, Loader2, Map } from "lucide-react";
import MapPicker from "./MapPicker";

const LocationBot = ({ isOpen, onClose }) => {
  const [locationInput, setLocationInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Hello! I'm your Mangrove Watch assistant. Please enter a location, coordinates, or use the map to select a location to check vegetation changes.",
      timestamp: new Date()
    }
  ]);

  const getPlaceName = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
      );
      const data = await response.json();
      return data.display_name || 'Unknown Location';
    } catch (error) {
      console.error('Error getting place name:', error);
      return 'Unknown Location';
    }
  };

  const handleLocationSelect = (coordinates) => {
    setLocationInput(coordinates);
    const userMessage = {
      id: Date.now(),
      type: "user",
      content: `Selected location: ${coordinates}`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!locationInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: locationInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://localhost:5000/check_location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: locationInput }),
      });
      const data = await response.json();
      
      if (data.latitude && data.longitude) {
        setResult(data);
        
        // Get place name for the coordinates
        const placeName = await getPlaceName(data.latitude, data.longitude);
        
        const botMessage = {
          id: Date.now() + 1,
          type: "bot",
          content: `📍 Location found!\n\n🌍 Place: ${placeName}\n\n📍 Coordinates: ${data.latitude}, ${data.longitude}\n\n🌿 Vegetation Change: ${data.vegetation_change !== undefined ? `${data.vegetation_change}%` : "N/A"}`,
          timestamp: new Date(),
          data: { ...data, placeName }
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        setError("Location not found or satellite data unavailable.");
        const botMessage = {
          id: Date.now() + 1,
          type: "bot",
          content: "Sorry, I couldn't find that location or satellite data is currently unavailable. Please try a different location or coordinates.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (err) {
      setError("Error connecting to backend.");
      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: "Sorry, I'm having trouble connecting to the server. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setLoading(false);
      setLocationInput("");
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-semibold">Mangrove Watch Bot</h3>
              <p className="text-xs text-green-100">Location & Vegetation Analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-green-600 text-white rounded-br-md'
                    : 'bg-white text-gray-800 rounded-bl-md shadow-sm border'
                }`}
              >
                <div className="whitespace-pre-line text-sm">{message.content}</div>
                {message.data && (
                  <div className="mt-2 pt-2 border-t border-green-200">
                    <div className="text-xs opacity-90">
                      <div>📍 {message.data.latitude}, {message.data.longitude}</div>
                      <div>🌿 Change: {message.data.vegetation_change !== undefined ? `${message.data.vegetation_change}%` : "N/A"}</div>
                    </div>
                  </div>
                )}
                <div className={`text-xs mt-1 ${message.type === 'user' ? 'text-green-100' : 'text-gray-500'}`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm border p-3">
                <div className="flex items-center space-x-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">Analyzing location...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <div className="flex-1 relative">
              <MapPin size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Enter location or coordinates..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowMap(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
              title="Select from map"
            >
              <Map size={16} />
            </button>
            <button
              type="submit"
              disabled={loading || !locationInput.trim()}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white p-2 rounded-full transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
          {error && (
            <div className="text-red-500 text-xs mt-2 text-center">{error}</div>
          )}
        </div>
      </div>

      {/* Map Picker Modal */}
      {showMap && (
        <MapPicker
          onLocationSelect={handleLocationSelect}
          onClose={() => setShowMap(false)}
        />
      )}
    </>
  );
};

export default LocationBot;