// src/utils/auth.js
export function setAuth({ username, email }) {
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("username", username);
  localStorage.setItem("email", email);
}
export function clearAuth() {
  localStorage.clear();
}
export function isAuthenticated() {
  return localStorage.getItem("isLoggedIn") === "true";
}
export function getAuth() {
  return {
    username: localStorage.getItem("username"),
    email: localStorage.getItem("email"),
  };
}