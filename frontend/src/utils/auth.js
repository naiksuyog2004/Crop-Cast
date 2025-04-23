// src/utils/auth.js

// Save user to localStorage
export const setUser = (userData) => {
  try {
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};

// Get user from localStorage
export const getUser = () => {
  try {
    const userData = localStorage.getItem('user');
    return userData && userData !== 'undefined' ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error reading user data:', error);
    return null;
  }
};

// Remove user from localStorage
export const removeUser = () => {
  try {
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error removing user data:', error);
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getUser();
};
