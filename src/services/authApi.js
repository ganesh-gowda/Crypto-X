import axios from 'axios';

// Use environment variable for API URL, fallback to relative path for local dev
const API_URL = import.meta.env.VITE_API_URL || '';

const authApi = axios.create({
  baseURL: `${API_URL}/api/auth`,
  withCredentials: true
});

export const signup = async (userData) => {
  try {
    const response = await authApi.post('/signup', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Signup failed';
  }
};

export const login = async (credentials) => {
  try {
    const response = await authApi.post('/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Login failed';
  }
};

export const getUser = async (userId) => {
  try {
    const response = await authApi.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch user';
  }
};

export default {
  signup,
  login,
  getUser
};