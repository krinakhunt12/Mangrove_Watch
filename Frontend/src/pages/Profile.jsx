// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { User, Mail, Settings, Shield } from "lucide-react";
import { getAuth, isAuthenticated } from "../utils/auth";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    const auth = getAuth();
    setUserData(auth);
  }, [navigate]);

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-green-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-900 mb-2">My Profile</h1>
          <p className="text-green-700">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-green-200">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                  <User size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-green-900">{userData.username}</h2>
                  <p className="text-green-700">{userData.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <User size={20} className="text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">Username</p>
                    <p className="text-green-700">{userData.username}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Mail size={20} className="text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">Email</p>
                    <p className="text-green-700">{userData.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Shield size={20} className="text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">Account Status</p>
                    <p className="text-green-700">Active</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Settings size={16} className="mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full border-green-300 text-green-700 hover:bg-green-50">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full border-green-300 text-green-700 hover:bg-green-50">
                  Notification Settings
                </Button>
              </div>
            </Card>

            {/* Statistics */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Your Activity</h3>
              <div className="space-y-4">
                <div className="text-center p-4 bg-green-100 rounded-lg">
                  <div className="text-2xl font-bold text-green-900">12</div>
                  <div className="text-green-700 text-sm">Reports Submitted</div>
                </div>
                <div className="text-center p-4 bg-blue-100 rounded-lg">
                  <div className="text-2xl font-bold text-blue-900">8</div>
                  <div className="text-blue-700 text-sm">Verified Reports</div>
                </div>
                <div className="text-center p-4 bg-yellow-100 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-900">450</div>
                  <div className="text-yellow-700 text-sm">Points Earned</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
