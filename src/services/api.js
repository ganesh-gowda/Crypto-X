// API service for cryptocurrency data

const API_KEY = "CG-zHwyYtX3PyVChYzVVcY47yvj"; // CoinGecko API key

// Fetch list of coins
export const fetchCoins = async () => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h%2C7d&x_cg_demo_api_key=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch coins: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
};

// Fetch details for a specific coin
export const fetchCoinDetails = async (coinId) => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true&x_cg_demo_api_key=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch coin details: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
};

// Fetch historical chart data
export const fetchChartData = async (coinId, days = 7) => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&x_cg_demo_api_key=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch chart data: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
};