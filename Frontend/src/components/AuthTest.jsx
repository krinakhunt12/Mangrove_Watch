// src/components/AuthTest.jsx
import { useState } from "react";
import { setAuth, clearAuth, isAuthenticated, getAuth } from "../utils/auth";

export default function AuthTest() {
  const [testUser, setTestUser] = useState("testuser");

  const testLogin = () => {
    setAuth({ username: testUser, email: "test@example.com" });
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('authStateChanged'));
    alert("Test login completed!");
  };

  const testLogout = () => {
    clearAuth();
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('authStateChanged'));
    alert("Test logout completed!");
  };

  const checkAuth = () => {
    const auth = isAuthenticated();
    const userData = getAuth();
    alert(`Auth: ${auth}\nUser Data: ${JSON.stringify(userData)}`);
  };

  return (
    <div className="fixed top-4 left-4 bg-white p-4 rounded-lg shadow-lg border z-50">
      <h3 className="font-bold mb-2">Auth Test</h3>
      <input
        type="text"
        value={testUser}
        onChange={(e) => setTestUser(e.target.value)}
        className="border p-1 mb-2 w-full"
        placeholder="Username"
      />
      <div className="space-y-1">
        <button
          onClick={testLogin}
          className="bg-green-600 text-white px-2 py-1 rounded text-sm w-full"
        >
          Test Login
        </button>
        <button
          onClick={testLogout}
          className="bg-red-600 text-white px-2 py-1 rounded text-sm w-full"
        >
          Test Logout
        </button>
        <button
          onClick={checkAuth}
          className="bg-blue-600 text-white px-2 py-1 rounded text-sm w-full"
        >
          Check Auth
        </button>
      </div>
    </div>
  );
}
