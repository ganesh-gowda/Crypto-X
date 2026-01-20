import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Use environment variable for API URL, fallback to relative path for local dev
const API_URL = import.meta.env.VITE_API_URL || '';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper: decode a JWT payload safely in the browser (no signature verification)
  const decodeJwt = (token) => {
    try {
      const payload = token.split('.')[1];
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decodeURIComponent(
        json
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      ));
    } catch (e) {
      return null;
    }
  };

  // Register a new user
  const signup = async (email, password, displayName) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/signup`, {
        email,
        password,
        displayName
      });
      // Persist token for session continuity
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });
      // Persist token for session continuity
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      // Clear JWT token from client-side storage
      localStorage.removeItem('token');
      setCurrentUser(null);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        // Decode token (no signature verification in browser)
        const decoded = decodeJwt(token);
        if (!decoded?.userId) {
          setLoading(false);
          localStorage.removeItem('token');
          return;
        }

        // Get user from API
        const response = await axios.get(`${API_URL}/api/auth/user/${decoded.userId}`);
        
        if (response.data) {
          setCurrentUser(response.data);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;