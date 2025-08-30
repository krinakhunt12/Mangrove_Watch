// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { isAuthenticated, getAuth, clearAuth } from "../utils/auth";
import { User, LogOut, Settings, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setIsLoggedIn(authStatus);
      if (authStatus) {
        const auth = getAuth();
        setUserData(auth);
      }
    };

    checkAuth();
    // Listen for storage changes (when login/logout happens in other components)
    window.addEventListener('storage', checkAuth);
    // Also listen for custom events
    window.addEventListener('authStateChanged', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authStateChanged', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    clearAuth();
    setIsLoggedIn(false);
    setUserData(null);
    setShowDropdown(false);
    setShowMobileMenu(false);
    // Dispatch events for immediate update
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('authStateChanged'));
    navigate('/');
  };

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  return (
    <nav className="bg-green-900 text-white py-4 px-6 shadow-md relative">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl">🌿</span>
          <h1 className="text-xl font-bold">Mangrove Watch</h1>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/features" className="hover:text-green-200 transition-colors">Features</Link>
          <Link to="/how-it-works" className="hover:text-green-200 transition-colors">How It Works</Link>
          {/* <Link to="/impact" className="hover:text-green-200 transition-colors">Impact</Link> */}
          <Link to="/about" className="hover:text-green-200 transition-colors">About</Link>
          <Link to="/report" className="hover:text-green-200 transition-colors">Report</Link>
        </div>

        {/* Desktop Authentication Section */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            // Profile Icon with Dropdown
            <div className="relative">
              <button
                onClick={handleProfileClick}
                className="flex items-center space-x-2 bg-green-800 hover:bg-green-700 px-3 py-2 rounded-lg transition-colors"
              >
                <User size={20} />
                <span>{userData?.username || 'User'}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <User size={16} className="mr-3" />
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <LogOut size={16} className="mr-3" />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Login / Sign Up Buttons
            <>
              <Link to="/login">
                <Button variant="outline" className="bg-transparent text-white border-white hover:bg-green-800">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-green-900 border-t border-green-800 z-50">
          <div className="px-6 py-4 space-y-4">
            {/* Mobile Navigation Links */}
            <div className="space-y-3">
              <Link to="/features" className="block hover:text-green-200 transition-colors" onClick={closeMobileMenu}>
                Features
              </Link>
              <Link to="/how-it-works" className="block hover:text-green-200 transition-colors" onClick={closeMobileMenu}>
                How It Works
              </Link>
              <Link to="/impact" className="block hover:text-green-200 transition-colors" onClick={closeMobileMenu}>
                Impact
              </Link>
              <Link to="/about" className="block hover:text-green-200 transition-colors" onClick={closeMobileMenu}>
                About
              </Link>
              <Link to="/report" className="block hover:text-green-200 transition-colors" onClick={closeMobileMenu}>
                Report
              </Link>
            </div>

            {/* Mobile Authentication Section */}
            <div className="pt-4 border-t border-green-800">
              {isLoggedIn ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-green-200">
                    <User size={20} />
                    <span>{userData?.username || 'User'}</span>
                  </div>
                  <Link
                    to="/profile"
                    className="block hover:text-green-200 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left hover:text-green-200 transition-colors"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link to="/login" className="block" onClick={closeMobileMenu}>
                    <Button variant="outline" className="w-full bg-transparent text-white border-white hover:bg-green-800">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" className="block" onClick={closeMobileMenu}>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown and mobile menu */}
      {(showDropdown || showMobileMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowDropdown(false);
            setShowMobileMenu(false);
          }}
        />
      )}
    </nav>
  );
}
