// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <nav className="bg-green-900 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl">🌿</span>
          <h1 className="text-xl font-bold">Mangrove Watch</h1>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/features" className="hover:text-green-200 transition-colors">Features</Link>
          <Link to="/how-it-works" className="hover:text-green-200 transition-colors">How It Works</Link>
          <Link to="/impact" className="hover:text-green-200 transition-colors">Impact</Link>
          <Link to="/about" className="hover:text-green-200 transition-colors">About</Link>
          <Link to="/report" className="hover:text-green-200 transition-colors">Report</Link>
        </div>

        {/* Login / Sign Up */}
        <div className="flex space-x-4">
          <Link to="/login">
            <Button variant="outline" className="bg-transparent text-white border-white hover:bg-green-800">
              Login
            </Button>
          </Link>
          <Link to="/login">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
