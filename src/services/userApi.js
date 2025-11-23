import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';

const API_URL = `${API_BASE_URL}/api`;

// Get token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Portfolio API calls
export const portfolioAPI = {
  getPortfolio: async () => {
    const response = await axios.get(`${API_URL}/portfolio`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  addToPortfolio: async (portfolioItem) => {
    const response = await axios.post(`${API_URL}/portfolio`, portfolioItem, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  updatePortfolioItem: async (id, portfolioItem) => {
    const response = await axios.put(`${API_URL}/portfolio/${id}`, portfolioItem, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  deletePortfolioItem: async (id) => {
    const response = await axios.delete(`${API_URL}/portfolio/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};

// Alerts API calls
export const alertsAPI = {
  getAlerts: async () => {
    const response = await axios.get(`${API_URL}/alerts`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  addAlert: async (alert) => {
    const response = await axios.post(`${API_URL}/alerts`, alert, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  updateAlert: async (id, alertData) => {
    const response = await axios.put(`${API_URL}/alerts/${id}`, alertData, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  deleteAlert: async (id) => {
    const response = await axios.delete(`${API_URL}/alerts/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};
