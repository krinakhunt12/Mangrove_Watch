import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getAuth, isAuthenticated } from "../utils/auth";

const UserPointsSection = () => {
  const [pointsData, setPointsData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPoints = async () => {
      if (!isAuthenticated()) return;
      
      const auth = getAuth();
      if (!auth?.user_id) return;

      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/user/points?user_id=${auth.user_id}`);
        const result = await response.json();
        
        if (result.status === "success") {
          setPointsData(result.data);
        }
      } catch (error) {
        console.error("Error fetching points:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
    
    // Listen for auth changes
    const handleAuthChange = () => {
      if (isAuthenticated()) {
        fetchPoints();
      } else {
        setPointsData(null);
      }
    };

    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  if (!isAuthenticated() || !pointsData) return null;

  return (
    <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-12 mb-16">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Your Conservation Impact</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Points Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-bold mb-2 text-yellow-300">
                {loading ? "..." : pointsData.points}
              </div>
              <div className="text-lg font-semibold mb-2">Conservation Points</div>
              <div className="text-sm opacity-90">
                Earned through verified mangrove reports
              </div>
            </div>

            {/* Reports Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-bold mb-2 text-green-300">
                {loading ? "..." : pointsData.total_reports}
              </div>
              <div className="text-lg font-semibold mb-2">Reports Submitted</div>
              <div className="text-sm opacity-90">
                Contributing to mangrove protection
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link
              to="/report"
              className="inline-flex items-center px-6 py-3 bg-white text-green-600 font-semibold rounded-full hover:bg-green-50 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="mr-2">📸</span>
              Submit New Report
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Landing() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
      <Navbar />
      
      {/* User Points Section */}
      <UserPointsSection />

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
          Protect Our
          <span className="text-green-600 block">Mangrove Ecosystems</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Join our community-driven initiative to monitor and protect vital mangrove forests through AI-powered reporting and satellite analysis.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/report"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Report an Issue
          </Link>
          <Link
            to="/about"
            className="bg-white text-green-600 border-2 border-green-600 hover:bg-green-50 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Report</h3>
              <p className="text-gray-600">
                Upload photos of mangrove issues using our mobile-friendly platform
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Analyze</h3>
              <p className="text-gray-600">
                AI validates reports and satellite data confirms environmental changes
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Protect</h3>
              <p className="text-gray-600">
                Conservation teams respond to verified threats to preserve ecosystems
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="bg-green-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">Our Global Impact</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-lg">Reports Submitted</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1,200</div>
              <div className="text-lg">Hectares Protected</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25</div>
              <div className="text-lg">Countries Involved</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Ready to Make a Difference?
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Every report counts. Join thousands of environmental guardians protecting our planet's most vital ecosystems.
        </p>
        <Link
          to="/signup"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Get Started Today
        </Link>
      </section>

      {/* Footer */}
    <footer className="bg-gray-800 text-white py-12">
  <div className="container mx-auto px-6">
    {/* Top Section: Logo + Description */}
    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-8">
      <div className="mb-6 md:mb-0">
        <h2 className="text-2xl font-bold mb-2">Mangrove Watch</h2>
        <p className="text-gray-400 max-w-sm">
          Protecting ecosystems through technology. Stay connected and help us monitor and conserve mangroves worldwide.
        </p>
      </div>

      {/* Quick Links */}
      <div className="flex flex-col md:flex-row gap-12">
        <div>
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="text-gray-400 space-y-1">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">About</a></li>
            <li><a href="#" className="hover:text-white">Projects</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <ul className="text-gray-400 space-y-1">
            <li>Email: <a href="mailto:info@mangrovewatch.org" className="hover:text-white">info@mangrovewatch.org</a></li>
            <li>Phone: <a href="tel:+911234567890" className="hover:text-white">+91 12345 67890</a></li>
            <li>Location: Surat, India</li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
            <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom Section */}
    <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
      © 2024 Mangrove Watch. All rights reserved.
    </div>
  </div>
</footer>

    </div>
  );
}
