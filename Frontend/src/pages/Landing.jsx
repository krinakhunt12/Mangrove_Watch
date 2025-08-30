import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import LocationBot from "../components/LocationBot"; // <-- Import the bot

export default function Landing() {
  const [currentImage, setCurrentImage] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBot, setShowBot] = useState(false); // <-- Add state for bot

  // Use a single Unsplash image for hero section
  const heroImage = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80";

  // Responsive menu toggle handler
  const handleMenuToggle = () => setMenuOpen((open) => !open);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-blue-50">
      {/* Mobile Navbar Toggle */}
      <div className="md:hidden flex justify-between items-center px-4 py-4 bg-green-900 text-white shadow-md">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🌿</span>
          <h1 className="text-xl font-bold">Mangrove Watch</h1>
        </div>
        <button
          className="focus:outline-none"
          aria-label="Open menu"
          onClick={handleMenuToggle}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Desktop Navbar */}
      <div className="hidden md:block">
        <Navbar />
      </div>
      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-end">
          <div className="w-64 bg-white h-full shadow-lg p-6 flex flex-col">
            <button
              className="self-end mb-6 text-green-900"
              aria-label="Close menu"
              onClick={handleMenuToggle}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <nav className="flex flex-col space-y-4">
              <Link to="/features" className="text-green-900 font-semibold" onClick={handleMenuToggle}>Features</Link>
              <Link to="/how-it-works" className="text-green-900 font-semibold" onClick={handleMenuToggle}>How It Works</Link>
              <Link to="/impact" className="text-green-900 font-semibold" onClick={handleMenuToggle}>Impact</Link>
              <Link to="/about" className="text-green-900 font-semibold" onClick={handleMenuToggle}>About</Link>
              <Link to="/report" className="text-green-900 font-semibold" onClick={handleMenuToggle}>Report</Link>
              <Link to="/login" className="text-green-900 font-semibold" onClick={handleMenuToggle}>Login</Link>
              <Link to="/login" className="text-green-900 font-semibold" onClick={handleMenuToggle}>Sign Up</Link>
            </nav>
          </div>
        </div>
      )}
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8 md:py-12">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto mb-10 md:mb-16 w-full">
          <div className="container mx-auto flex flex-col md:flex-row items-center md:items-start md:space-x-12">
            {/* Text Section */}
            <div className="md:w-1/2 w-full text-center md:text-left mb-8 md:mb-0">
              <h1 className="text-3xl md:text-5xl font-bold text-green-900 mb-6 leading-tight">
                Protect our Mangroves Together
              </h1>
              <p className="text-base md:text-xl text-green-800 mb-8 max-w-lg mx-auto md:mx-0">
                Join the community-driven conservation platform to monitor, report, and protect mangrove ecosystems worldwide.
              </p>
              <Link to="/home">
                <Button className="bg-green-600 hover:bg-green-700 text-white text-base md:text-lg px-6 md:px-8 py-3 rounded-2xl shadow-md transition-all hover:scale-105">
                  Get Started
                </Button>
              </Link>
            </div>
            {/* Image Section */}
            <div className="md:w-1/2 w-full relative h-56 md:h-80 overflow-hidden rounded-2xl shadow-lg">
              <img
                src={heroImage}
                alt="Mangrove ecosystem"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full max-w-6xl mb-12 md:mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-green-900 text-center mb-8 md:mb-12">
            How You Can Help
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md text-center">
              <div className="text-3xl md:text-4xl mb-2 md:mb-4">📱</div>
              <h3 className="text-lg md:text-xl font-semibold text-green-800 mb-2 md:mb-3">
                Report Incidents
              </h3>
              <p className="text-green-700 text-sm md:text-base">
                Use our mobile app to report illegal cutting, dumping, or other threats to mangroves.
              </p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md text-center">
              <div className="text-3xl md:text-4xl mb-2 md:mb-4">🛰️</div>
              <h3 className="text-lg md:text-xl font-semibold text-green-800 mb-2 md:mb-3">
                AI Verification
              </h3>
              <p className="text-green-700 text-sm md:text-base">
                Our system uses satellite data and AI to validate reports for accuracy.
              </p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md text-center">
              <div className="text-3xl md:text-4xl mb-2 md:mb-4">🏆</div>
              <h3 className="text-lg md:text-xl font-semibold text-green-800 mb-2 md:mb-3">
                Earn Rewards
              </h3>
              <p className="text-green-700 text-sm md:text-base">
                Collect points, climb leaderboards, and receive rewards for your contributions.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full max-w-4xl mb-12 md:mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-green-900 text-center mb-8 md:mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md">
              <h3 className="text-lg md:text-xl font-semibold text-green-800 mb-2 md:mb-3">1. Sign Up & Download</h3>
              <p className="text-green-700 text-sm md:text-base">Create an account and download our mobile app to get started.</p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md md:mt-8">
              <h3 className="text-lg md:text-xl font-semibold text-green-800 mb-2 md:mb-3">2. Report Issues</h3>
              <p className="text-green-700 text-sm md:text-base">When you spot a threat to mangroves, report it with geotagged photos.</p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md">
              <h3 className="text-lg md:text-xl font-semibold text-green-800 mb-2 md:mb-3">3. AI Validation</h3>
              <p className="text-green-700 text-sm md:text-base">Our system verifies reports using satellite imagery and AI analysis.</p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md md:mt-8">
              <h3 className="text-lg md:text-xl font-semibold text-green-800 mb-2 md:mb-3">4. Earn Points</h3>
              <p className="text-green-700 text-sm md:text-base">Get rewarded with points for verified reports and climb the leaderboard.</p>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section id="impact" className="w-full max-w-5xl mb-10 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-green-900 text-center mb-8 md:mb-12">
            Our Impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
            <div className="bg-green-100 p-3 md:p-4 rounded-2xl">
              <div className="text-xl md:text-3xl font-bold text-green-900">250+</div>
              <div className="text-green-700 text-xs md:text-base">Communities</div>
            </div>
            <div className="bg-green-100 p-3 md:p-4 rounded-2xl">
              <div className="text-xl md:text-3xl font-bold text-green-900">5,280</div>
              <div className="text-green-700 text-xs md:text-base">Reports Filed</div>
            </div>
            <div className="bg-green-100 p-3 md:p-4 rounded-2xl">
              <div className="text-xl md:text-3xl font-bold text-green-900">340</div>
              <div className="text-green-700 text-xs md:text-base">Hectares Protected</div>
            </div>
            <div className="bg-green-100 p-3 md:p-4 rounded-2xl">
              <div className="text-xl md:text-3xl font-bold text-green-900">12,500+</div>
              <div className="text-green-700 text-xs md:text-base">Trees Saved</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-8 md:py-12 px-4 md:px-6">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🌿</span>
              <h2 className="text-lg md:text-xl font-bold">Mangrove Watch</h2>
            </div>
            <p className="text-green-200 text-sm md:text-base">
              Protecting coastal biodiversity through community participation and technology.
            </p>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-green-200 hover:text-white transition-colors text-sm md:text-base">About Us</a></li>
              <li><a href="#" className="text-green-200 hover:text-white transition-colors text-sm md:text-base">Get Involved</a></li>
              <li><a href="#" className="text-green-200 hover:text-white transition-colors text-sm md:text-base">Resources</a></li>
              <li><a href="#" className="text-green-200 hover:text-white transition-colors text-sm md:text-base">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-green-200 hover:text-white transition-colors text-sm md:text-base">Privacy Policy</a></li>
              <li><a href="#" className="text-green-200 hover:text-white transition-colors text-sm md:text-base">Terms of Service</a></li>
              <li><a href="#" className="text-green-200 hover:text-white transition-colors text-sm md:text-base">Cookie Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-green-200 hover:text-white transition-colors text-xl md:text-2xl" aria-label="Facebook">📘</a>
              <a href="#" className="text-green-200 hover:text-white transition-colors text-xl md:text-2xl" aria-label="Twitter">🐦</a>
              <a href="#" className="text-green-200 hover:text-white transition-colors text-xl md:text-2xl" aria-label="Instagram">📸</a>
              <a href="#" className="text-green-200 hover:text-white transition-colors text-xl md:text-2xl" aria-label="YouTube">📺</a>
            </div>
            <p className="text-green-200 text-sm md:text-base">support@mangrovewatch.org</p>
          </div>
        </div>
        <div className="container mx-auto mt-6 md:mt-8 pt-6 md:pt-8 border-t border-green-800 text-center text-green-300 text-xs md:text-base">
          <p>© {new Date().getFullYear()} Mangrove Watch. All rights reserved.</p>
        </div>
      </footer>

      {/* Bot Icon (bottom right) */}
      <button
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 10000,
          background: "#2e7d32",
          borderRadius: "50%",
          width: 56,
          height: 56,
          boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          cursor: "pointer",
        }}
        aria-label="Open Location Bot"
        onClick={() => setShowBot(true)}
      >
        <span style={{ fontSize: "2rem", color: "#fff" }}>🤖</span>
      </button>

      {/* LocationBot Popup */}
      {showBot && (
        <div style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 10001,
        }}>
          <LocationBot />
          <button
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "transparent",
              border: "none",
              fontSize: "1.5rem",
              color: "#2e7d32",
              cursor: "pointer",
            }}
            aria-label="Close Location Bot"
            onClick={() => setShowBot(false)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
