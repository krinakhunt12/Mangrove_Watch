import React, { useState } from "react";

const LocationBot = () => {
  const [locationInput, setLocationInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      } else {
        setError("Location not found or satellite data unavailable.");
      }
    } catch (err) {
      setError("Error connecting to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      bottom: 24,
      right: 24,
      zIndex: 9999,
      background: "#fff",
      borderRadius: "16px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
      padding: "20px",
      width: "320px",
      maxWidth: "90vw",
      fontFamily: "sans-serif"
    }}>
      <h3 style={{marginBottom: 8}}>🌍 Location Bot</h3>
      <form onSubmit={handleSubmit} style={{display: "flex", gap: 8}}>
        <input
          type="text"
          value={locationInput}
          onChange={e => setLocationInput(e.target.value)}
          placeholder="Enter address or lat,lon"
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
          required
        />
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            background: "#2e7d32",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer"
          }}
          disabled={loading}
        >
          {loading ? "..." : "Check"}
        </button>
      </form>
      {error && <div style={{color: "red", marginTop: 8}}>{error}</div>}
      {result && (
        <div style={{marginTop: 16, fontSize: "15px"}}>
          <div><strong>Latitude:</strong> {result.latitude}</div>
          <div><strong>Longitude:</strong> {result.longitude}</div>
          <div>
            <strong>Vegetation Change:</strong>{" "}
            {result.vegetation_change !== undefined
              ? `${result.vegetation_change}%`
              : "N/A"}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationBot;