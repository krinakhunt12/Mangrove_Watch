import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import Navbar from "../components/Navbar";

// Custom icons for different report types
const reportIcons = {
  "Mangrove Cutting": new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/484/484562.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  }),
  "Dumping Waste": new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2750/2750760.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  }),
  "Oil Spill": new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3215/3215802.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  }),
};

// Dummy report data
const reports = [
  { id: 1, lat: 16.45, lng: 80.62, type: "Mangrove Cutting", reporter: "Ravi", date: "2 hours ago" },
  { id: 2, lat: 16.47, lng: 80.64, type: "Dumping Waste", reporter: "Asha", date: "5 hours ago" },
  { id: 3, lat: 16.48, lng: 80.61, type: "Oil Spill", reporter: "Meera", date: "1 day ago" },
];

// Dummy leaderboard
const leaderboard = [
  { name: "Ravi", points: 120, avatar: "🌿" },
  { name: "Asha", points: 110, avatar: "🌱" },
  { name: "Meera", points: 90, avatar: "🍃" },
];

export default function Home() {
  const [user] = useState({
    name: "You",
    badge: "Mangrove Guardian",
    level: "Eco Defender",
    reports: 8,
    avatar: "🦉",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-100">
      {/* Common Navbar */}
      <Navbar />
      
      <div className="p-2 md:p-6">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-6 bg-white rounded-3xl shadow-2xl border border-green-200">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-3 rounded-full shadow">
                <span className="text-2xl text-white">🌿</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-green-900">Welcome, {user.name}</h2>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2">
              <span className="text-green-700 font-semibold">Reports: {user.reports}</span>
              <span className="text-green-700 font-semibold">Level: {user.level}</span>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-md text-center border border-green-100">
            <div className="text-2xl font-bold text-green-700">{reports.length}</div>
            <div className="text-sm text-green-600">Active Reports</div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-md text-center border border-green-100">
            <div className="text-2xl font-bold text-green-700">{leaderboard.length}</div>
            <div className="text-sm text-green-600">Active Guardians</div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-md text-center border border-green-100">
            <div className="text-2xl font-bold text-green-700">16</div>
            <div className="text-sm text-green-600">Resolved Issues</div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-md text-center border border-green-100">
            <div className="text-2xl font-bold text-green-700">92%</div>
            <div className="text-sm text-green-600">Community Score</div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid gap-6">
          {/* Map Section */}
          <Card className="shadow-lg rounded-3xl overflow-hidden border-0">
            <CardHeader className="bg-green-700 text-white py-4">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <span>🗺️</span> Live Incidents Map
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <MapContainer
                center={[16.46, 80.63]}
                zoom={13}
                style={{ height: "350px", width: "100%" }}
                zoomControl={true}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {reports.map((r) => (
                  <Marker 
                    key={r.id} 
                    position={[r.lat, r.lng]} 
                    icon={reportIcons[r.type] || reportIcons["Mangrove Cutting"]}
                  >
                    <Popup className="rounded-xl">
                      <div className="p-2">
                        <h3 className="font-bold text-green-800">{r.type}</h3>
                        <p className="text-sm">Reported by {r.reporter}</p>
                        <p className="text-xs text-gray-500">{r.date}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </CardContent>
          </Card>

          {/* User Stats + Leaderboard */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* User Stats */}
            <Card className="shadow-lg rounded-3xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <span>{user.avatar}</span> Your Guardian Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 bg-white">
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div className="bg-green-50 p-3 rounded-xl text-center">
                    <div className="text-2xl font-bold text-green-700">{user.reports}</div>
                    <div className="text-sm text-green-600">Reports</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                    <span className="font-medium">Level:</span>
                    <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm">{user.level}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                    <span className="font-medium">Badge:</span>
                    <span className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm">{user.badge}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-green-100">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${(user.points / 150) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{150 - user.points} points to next level</p>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard Preview */}
            <Card className="shadow-lg rounded-3xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-amber-600 to-amber-700 text-white py-4">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <span>🏆</span> Guardian Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 bg-white">
                <ul className="space-y-3">
                  {leaderboard.map((u, i) => (
                    <li 
                      key={i} 
                      className={`flex justify-between items-center p-3 rounded-xl ${
                        i === 0 ? "bg-amber-50" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full p-2 ${
                          i === 0 ? "bg-amber-200" : 
                          i === 1 ? "bg-gray-200" : 
                          i === 2 ? "bg-amber-100" : "bg-green-100"
                        }`}>
                          <span>{u.avatar}</span>
                        </div>
                        <div>
                          <span className="font-medium">{u.name}</span>
                          {i === 0 && <span className="ml-2 text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">Top Guardian</span>}
                        </div>
                      </div>
                      <span className="font-semibold text-green-700">{u.points} pts</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/leaderboard" 
                  className="block text-center mt-4 text-green-600 font-medium hover:text-green-800 transition-colors py-2 border border-green-200 rounded-xl"
                >
                  View Full Leaderboard →
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="shadow-lg rounded-3xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <span>📋</span> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 bg-white">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <span className="text-blue-600">🌿</span>
                  </div>
                  <div>
                    <h4 className="font-medium">You reported illegal mangrove cutting</h4>
                    <p className="text-sm text-gray-500">2 days ago • 15 points earned</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <span className="text-green-600">✅</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Your report was verified by authorities</h4>
                    <p className="text-sm text-gray-500">1 day ago • 10 points earned</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <span className="text-amber-600">🏆</span>
                  </div>
                  <div>
                    <h4 className="font-medium">You earned the Mangrove Guardian badge</h4>
                    <p className="text-sm text-gray-500">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}