// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { User, Mail, Settings, Shield, RefreshCw } from "lucide-react";
import { getAuth, isAuthenticated } from "../utils/auth";
import Navbar from "../components/Navbar";
export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user statistics from API
  const fetchUserStats = async (userId) => {
    try {
      setStatsLoading(true);
      const response = await fetch(`http://localhost:5000/user/stats?user_id=${userId}`);
      const result = await response.json();
      
      if (result.status === "success") {
        setUserStats(result.data);
      } else {
        console.error("Error fetching user stats:", result.message);
        setError("Failed to load user statistics");
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
      setError("Failed to load user statistics");
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch user reports
  const fetchUserReports = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/user/reports?user_id=${userId}`);
      const result = await response.json();
      
      if (result.status === "success") {
        // Calculate additional statistics
        const totalReports = result.data.length;
        const verifiedReports = result.data.filter(report => report.label && report.label.includes("mangrove")).length;
        const avgConfidence = result.data.length > 0 
          ? result.data.reduce((sum, report) => sum + (report.confidence || 0), 0) / result.data.length 
          : 0;
        
        setUserStats(prev => ({
          ...prev,
          total_reports: totalReports,
          verified_reports: verifiedReports,
          avg_confidence: avgConfidence,
          reports: result.data
        }));
      }
    } catch (error) {
      console.error("Error fetching user reports:", error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    const auth = getAuth();
    setUserData(auth);
    
    if (auth?.user_id) {
      fetchUserStats(auth.user_id);
      fetchUserReports(auth.user_id);
    }
    
    setLoading(false);
  }, [navigate]);

  // Listen for reports updates from Report page
  useEffect(() => {
    const handleReportsUpdate = () => {
      if (userData?.user_id) {
        fetchUserStats(userData.user_id);
        fetchUserReports(userData.user_id);
      }
    };

    window.addEventListener('reportsUpdated', handleReportsUpdate);
    return () => window.removeEventListener('reportsUpdated', handleReportsUpdate);
  }, [userData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-green-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">User data not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <Navbar/>
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-green-900">Your Activity</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (userData?.user_id) {
                      fetchUserStats(userData.user_id);
                      fetchUserReports(userData.user_id);
                    }
                  }}
                  disabled={statsLoading}
                  className="p-1 h-auto"
                >
                  <RefreshCw size={16} className={`text-green-600 ${statsLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              
              {error && (
                <div className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="text-center p-4 bg-green-100 rounded-lg">
                  <div className="text-2xl font-bold text-green-900">
                    {statsLoading ? (
                      <div className="animate-pulse">...</div>
                    ) : (
                      userStats?.total_reports || 0
                    )}
                  </div>
                  <div className="text-green-700 text-sm">Reports Submitted</div>
                </div>
                
                <div className="text-center p-4 bg-blue-100 rounded-lg">
                  <div className="text-2xl font-bold text-blue-900">
                    {statsLoading ? (
                      <div className="animate-pulse">...</div>
                    ) : (
                      userStats?.verified_reports || 0
                    )}
                  </div>
                  <div className="text-blue-700 text-sm">Verified Reports</div>
                </div>
                
                <div className="text-center p-4 bg-yellow-100 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-900">
                    {statsLoading ? (
                      <div className="animate-pulse">...</div>
                    ) : (
                      userStats?.avg_confidence ? `${Math.round(userStats.avg_confidence * 100)}%` : "0%"
                    )}
                  </div>
                  <div className="text-yellow-700 text-sm">Avg Confidence</div>
                </div>
              </div>
              
              {/* Additional Stats */}
              {userStats?.avg_confidence !== undefined && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-900">
                        {statsLoading ? "..." : `${Math.round(userStats.avg_confidence * 100)}%`}
                      </div>
                      <div className="text-purple-700 text-xs">Avg Confidence</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-lg font-bold text-orange-900">
                        {statsLoading ? "..." : userStats?.reports?.length > 0 ? 
                          `${Math.round((userStats.verified_reports / userStats.total_reports) * 100)}%` : "0%"
                        }
                      </div>
                      <div className="text-orange-700 text-xs">Success Rate</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Reports Preview */}
              {userStats?.reports && userStats.reports.length > 0 && (
                <div className="mt-6 pt-4 border-t border-green-200">
                  <h4 className="text-sm font-semibold text-green-900 mb-3">Recent Reports</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {userStats.reports.slice(0, 3).map((report, index) => (
                      <div key={index} className="text-xs p-2 bg-blue-50 rounded">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-blue-700 font-medium truncate">
                            {report.label || 'Mangrove Issue'}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            report.label && report.label.includes("mangrove")
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {report.label && report.label.includes("mangrove") ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                        <div className="text-blue-600 text-xs">
                          {report.confidence ? `Confidence: ${Math.round(report.confidence * 100)}%` : ''}
                          {report.satellite_vegetation_change && report.satellite_vegetation_change !== 'null' 
                            ? ` • Satellite: ${parseFloat(report.satellite_vegetation_change).toFixed(1)}%`
                            : ''
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
