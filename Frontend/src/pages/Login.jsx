// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Mail, Lock } from "lucide-react";
import { setAuth } from "../utils/auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const result = await response.json();
      if (result.status === "success") {
        // Store authentication data
        setAuth({ username: result.username, email: result.email });
        // Trigger storage event for navbar update
        window.dispatchEvent(new Event('storage'));
        // Also dispatch custom event for immediate update
        window.dispatchEvent(new Event('authStateChanged'));
        alert("Logged in successfully!");
        navigate("/");
      } else {
        setError(result.message || "Login failed.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-green-200 relative overflow-hidden">
      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
        alt="Mangrove"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/70 via-white/60 to-blue-100/70 backdrop-blur-sm"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-green-200 animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-green-900">Welcome Back</h1>
          <p className="text-green-700 mt-2">Login to continue exploring</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Username Input */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600" size={20} />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-green-300 bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600" size={20} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-green-300 bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-green-700 hover:text-green-900 hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Error Message */}
          {error && <div className="text-red-600 text-center text-sm">{error}</div>}

          {/* Submit Button */}
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white rounded-2xl py-3 shadow-md transition-all hover:scale-105"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* Sign Up Link */}
        <p className="mt-6 text-center text-green-700">
          Don’t have an account?{" "}
          <Link to="/signup" className="font-semibold text-green-900 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
