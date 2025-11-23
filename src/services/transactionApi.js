import axios from 'axios';
import { API_ENDPOINTS } from '../config/apiConfig';

const API_URL = API_ENDPOINTS.TRANSACTIONS;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const transactionAPI = {
  // Get all transactions with optional filters
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.coinId) params.append('coinId', filters.coinId);
      if (filters.type) params.append('type', filters.type);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.limit) params.append('limit', filters.limit);
      
      const response = await axios.get(
        `${API_URL}?${params.toString()}`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get transaction statistics
  getStats: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/stats`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create a new transaction
  create: async (transactionData) => {
    try {
      const response = await axios.post(
        API_URL,
        transactionData,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete a transaction
  delete: async (id) => {
    try {
      const response = await axios.delete(
        `${API_URL}/${id}`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
