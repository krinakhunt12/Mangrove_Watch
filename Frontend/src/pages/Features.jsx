// src/pages/Features.jsx
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Features() {
  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <header className="text-center py-10 md:py-16 bg-green-100">
        <h1 className="text-3xl md:text-5xl font-bold text-green-900 mb-4">
          How You Can Help
        </h1>
        <p className="text-base md:text-xl text-green-800 max-w-2xl mx-auto">
          Learn how Mangrove Watch empowers communities to protect mangroves and earn rewards for their contributions.
        </p>
      </header>

      {/* Features Section */}
      <main className="flex-grow container mx-auto py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-md text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-lg md:text-xl font-semibold text-green-800 mb-3">Report Incidents</h3>
            <p className="text-green-700 text-base md:text-lg">
              Use our mobile app to report illegal cutting, dumping, or other threats to mangroves in your area.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md text-center">
            <div className="text-4xl mb-4">🛰️</div>
            <h3 className="text-lg md:text-xl font-semibold text-green-800 mb-3">AI Verification</h3>
            <p className="text-green-700 text-base md:text-lg">
              Our system verifies reports using satellite data and AI analysis to ensure accuracy and reliability.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-lg md:text-xl font-semibold text-green-800 mb-3">Earn Rewards</h3>
            <p className="text-green-700 text-base md:text-lg">
              Collect points, climb the leaderboard, and earn rewards for your verified contributions to mangrove conservation.
            </p>
          </div>
        </div>

        {/* Optional CTA */}
        <div className="text-center mt-10 md:mt-16">
          <Link to="/register">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 md:px-8 py-3 rounded-2xl shadow-md transition-all hover:scale-105 text-base md:text-lg">
              Get Started
            </button>
          </Link>
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
