import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getAuth, isAuthenticated } from "../utils/auth";
import { motion } from "framer-motion";

const UserStatsSection = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (!isAuthenticated()) return;
      
      const auth = getAuth();
      if (!auth?.user_id) return;

      setLoading(true);
      try {
  const response = await fetch(`http://127.0.0.1:5000/user/stats?user_id=${auth.user_id}`);
        const result = await response.json();
        
        if (result.status === "success") {
          setStatsData(result.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Listen for auth changes
    const handleAuthChange = () => {
      if (isAuthenticated()) {
        fetchStats();
      } else {
        setStatsData(null);
      }
    };

    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  if (!isAuthenticated() || !statsData) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-12 mb-16"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Your Conservation Impact</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Reports Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <div className="text-4xl font-bold mb-2 text-green-300">
                {loading ? "..." : statsData.total_reports}
              </div>
              <div className="text-lg font-semibold mb-2">Reports Submitted</div>
              <div className="text-sm opacity-90">
                Contributing to mangrove protection
              </div>
            </motion.div>

            {/* Impact Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <div className="text-4xl font-bold mb-2 text-yellow-300">
                🌿
              </div>
              <div className="text-lg font-semibold mb-2">Mangrove Guardian</div>
              <div className="text-sm opacity-90">
                Helping protect coastal ecosystems
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <Link
              to="/report"
              className="inline-flex items-center px-6 py-3 bg-white text-green-600 font-semibold rounded-full hover:bg-green-50 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="mr-2">📸</span>
              Submit New Report
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Landing() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
      <Navbar />
      
      {/* User Stats Section */}
      <UserStatsSection />

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
            Protect Our
            <span className="text-green-600 block">Mangrove Ecosystems</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Join our community-driven initiative to monitor and protect vital mangrove forests through AI-powered reporting and satellite analysis. Every report makes a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/report"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Report an Issue
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/about"
                className="bg-white text-green-600 border-2 border-green-600 hover:bg-green-50 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      

      {/* Features Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our three-step process makes it easy for anyone to contribute to mangrove conservation
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100"
            >
              <div className="text-6xl mb-6">📱</div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Report</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload photos of mangrove issues using our mobile-friendly platform. 
                Add location details and descriptions to help our AI understand the situation.
              </p>
              <div className="mt-6 text-sm text-green-600 font-medium">
                • Easy photo upload<br/>
                • GPS location tracking<br/>
                • Detailed descriptions
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100"
            >
              <div className="text-6xl mb-6">🤖</div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Analyze</h3>
              <p className="text-gray-600 leading-relaxed">
                Our advanced AI validates reports and satellite data confirms environmental changes. 
                Get instant feedback on your submission.
              </p>
              <div className="mt-6 text-sm text-green-600 font-medium">
                • AI-powered validation<br/>
                • Satellite data correlation<br/>
                • Real-time analysis
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100"
            >
              <div className="text-6xl mb-6">🛡️</div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Protect</h3>
              <p className="text-gray-600 leading-relaxed">
                Conservation teams respond to verified threats to preserve ecosystems. 
                Your reports directly contribute to environmental protection efforts.
              </p>
              <div className="mt-6 text-sm text-green-600 font-medium">
                • Expert team response<br/>
                • Conservation action<br/>
                • Impact tracking
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Powered by Advanced Technology
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our platform combines cutting-edge AI, satellite imagery, and community engagement to create a powerful conservation tool.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <span className="text-green-600 text-xl">🔍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">AI Image Recognition</h3>
                    <p className="text-gray-600">Advanced computer vision identifies mangrove-related issues with high accuracy</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <span className="text-blue-600 text-xl">🛰️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Satellite Monitoring</h3>
                    <p className="text-gray-600">Real-time satellite data validates environmental changes and vegetation loss</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <span className="text-purple-600 text-xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Data Analytics</h3>
                    <p className="text-gray-600">Comprehensive reporting and trend analysis for conservation planning</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Real-time Dashboard</h3>
                <div className="space-y-4">
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span>Active Reports</span>
                      <span className="font-bold">1,247</span>
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span>Verified Issues</span>
                      <span className="font-bold">892</span>
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span>Response Time</span>
                      <span className="font-bold">2.3 hrs</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What Our Community Says
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from environmental activists and conservationists who use our platform
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 text-xl">🌿</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Dr. Sarah Chen</h4>
                  <p className="text-sm text-gray-600">Marine Biologist</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "This platform has revolutionized how we monitor mangrove health. The AI accuracy is impressive, and the community engagement is inspiring."
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 text-xl">🌊</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Ravi Kumar</h4>
                  <p className="text-sm text-gray-600">Local Activist</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "As a local activist, I can now document and report issues instantly. The platform has given our community a powerful voice."
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 text-xl">🦀</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Maria Santos</h4>
                  <p className="text-sm text-gray-600">Conservation Officer</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The combination of AI and satellite data has improved our response time dramatically. We can now act before it's too late."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Every report counts. Join thousands of environmental guardians protecting our planet's most vital ecosystems. 
            Start contributing to mangrove conservation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Get Started Today
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/about"
                className="bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </motion.div>
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
