// src/utils/auth.js

// Store authentication data in localStorage
export const setAuth = (authData) => {
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('username', authData.username);
  localStorage.setItem('email', authData.email);
  localStorage.setItem('user_id', authData.user_id);
};

// Clear authentication data from localStorage
export const clearAuth = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('username');
  localStorage.removeItem('email');
  localStorage.removeItem('user_id');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

// Get authentication data
export const getAuth = () => {
  if (!isAuthenticated()) return null;
  
  return {
    username: localStorage.getItem('username'),
    email: localStorage.getItem('email'),
    user_id: localStorage.getItem('user_id')
  };
};