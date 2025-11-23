// API Configuration
// This file centralizes all API URLs for easy deployment configuration

// Backend API URL - uses environment variable in production, localhost in development
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: `${API_BASE_URL}/api/auth`,
  
  // Portfolio
  PORTFOLIO: `${API_BASE_URL}/api/portfolio`,
  PORTFOLIO_ANALYTICS: `${API_BASE_URL}/api/portfolio/analytics`,
  
  // Transactions
  TRANSACTIONS: `${API_BASE_URL}/api/transactions`,
  
  // Alerts
  ALERTS: `${API_BASE_URL}/api/alerts`,
  
  // Search
  SEARCH: `${API_BASE_URL}/api/search`,
  SEARCH_GLOBAL: `${API_BASE_URL}/api/search/global`,
  SEARCH_WATCHLIST: `${API_BASE_URL}/api/search/watchlist`,
  SEARCH_FILTERS: `${API_BASE_URL}/api/search/filters`,
  
  // Reports
  REPORTS: `${API_BASE_URL}/api/reports`,
  REPORTS_PORTFOLIO: `${API_BASE_URL}/api/reports/portfolio-data`,
  REPORTS_TRANSACTIONS_CSV: `${API_BASE_URL}/api/reports/transactions-csv`,
  REPORTS_ALERTS_CSV: `${API_BASE_URL}/api/reports/alerts-csv`,
  REPORTS_TAX: `${API_BASE_URL}/api/reports/tax-report`,
  
  // Email Verification
  VERIFY: `${API_BASE_URL}/api/verify`,
  VERIFY_SEND: `${API_BASE_URL}/api/verify/send`,
  VERIFY_CONFIRM: `${API_BASE_URL}/api/verify/confirm`,
  
  // Two-Factor Authentication
  TWO_FACTOR: `${API_BASE_URL}/api/2fa`,
  TWO_FACTOR_STATUS: `${API_BASE_URL}/api/2fa/status`,
  TWO_FACTOR_SETUP: `${API_BASE_URL}/api/2fa/setup`,
  TWO_FACTOR_VERIFY: `${API_BASE_URL}/api/2fa/verify`,
  TWO_FACTOR_VERIFY_LOGIN: `${API_BASE_URL}/api/2fa/verify-login`,
  TWO_FACTOR_DISABLE: `${API_BASE_URL}/api/2fa/disable`,
  TWO_FACTOR_BACKUP_CODES: `${API_BASE_URL}/api/2fa/backup-codes`,
  TWO_FACTOR_REGENERATE_CODES: `${API_BASE_URL}/api/2fa/regenerate-backup-codes`,
  TWO_FACTOR_LOGIN: `${API_BASE_URL}/api/auth/login-2fa`,
};

// WebSocket URL
export const SOCKET_URL = API_BASE_URL;

export default API_BASE_URL;
