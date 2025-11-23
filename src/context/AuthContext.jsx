import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/apiConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = API_ENDPOINTS.AUTH;

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          // Verify token is still valid
          const response = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          
          // Create user object with displayName for compatibility
          const user = {
            ...response.data,
            displayName: response.data.username || response.data.email?.split('@')[0],
            uid: response.data._id
          };
          
          setCurrentUser(user);
          setToken(storedToken);
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setCurrentUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Register a new user
  const signup = async (email, password, username) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
        username
      });

      const { token: newToken, ...userData } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(newToken);
      
      // Create user object with displayName for compatibility
      const user = {
        ...userData,
        displayName: userData.username || email.split('@')[0],
        uid: userData._id
      };
      
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error("Signup error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create account');
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      const { token: newToken, ...userData } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(newToken);
      
      // Create user object with displayName for compatibility
      const user = {
        ...userData,
        displayName: userData.username || email.split('@')[0],
        uid: userData._id
      };
      
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error("Login error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Failed to log in');
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setCurrentUser(null);
    delete axios.defaults.headers.common['Authorization'];
    return Promise.resolve();
  };

  // Get user data
  const getUserData = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    getUserData,
    loading,
    token
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;