// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with real registration logic
    if (name && email && password) {
      alert("Account created successfully!");
      navigate("/login"); // Redirect to login after sign up
    } else {
      alert("Please fill all fields.");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-green-200">
          <h2 className="text-3xl font-bold text-green-900 text-center mb-6">
            Sign Up
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-green-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-green-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-green-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white rounded-2xl py-3 shadow-md transition-all hover:scale-105"
            >
              Sign Up
            </Button>
          </form>
          <p className="mt-4 text-center text-green-700">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-green-900 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
