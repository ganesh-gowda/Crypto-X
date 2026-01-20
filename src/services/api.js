// API service for cryptocurrency data

const API_KEY = "CG-zHwyYtX3PyVChYzVVcY47yvj"; // CoinGecko API key
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
const cache = {};

const handleApiError = (error, endpoint) => {
  if (error.message.includes('429')) {
    throw new Error('API rate limit exceeded. Please try again later.');
  }
  throw new Error(`Failed to fetch ${endpoint}: ${error.message}`);
};

const getFromCache = (key) => {
  const cached = cache[key];
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const addToCache = (key, data) => {
  cache[key] = {
    data,
    timestamp: Date.now()
  };
};

// Fetch list of coins
export const fetchCoins = async () => {
  const cacheKey = 'coins-market';
  const cachedData = getFromCache(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h%2C7d&x_cg_demo_api_key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    addToCache(cacheKey, data);
    return data;
  } catch (error) {
    handleApiError(error, 'coins');
  }
};

// Fetch details for a specific coin
export const fetchCoinDetails = async (coinId) => {
  const cacheKey = `coin-details-${coinId}`;
  const cachedData = getFromCache(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true&x_cg_demo_api_key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    addToCache(cacheKey, data);
    return data;
  } catch (error) {
    handleApiError(error, 'coin details');
  }
};

// Fetch historical chart data
export const fetchChartData = async (coinId, days = 7) => {
  const cacheKey = `chart-data-${coinId}-${days}`;
  const cachedData = getFromCache(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&x_cg_demo_api_key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    addToCache(cacheKey, data);
    return data;
  } catch (error) {
    handleApiError(error, 'chart data');
  }
};