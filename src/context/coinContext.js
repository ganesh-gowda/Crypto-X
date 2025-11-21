import axios from 'axios';

// Simple rate limiter - avoid hitting API too frequently
let lastApiCall = 0;
const MIN_API_INTERVAL = 1000; // 1 second between calls

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const makeApiCall = async (url, retries = 3) => {
  // Rate limiting
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCall;
  if (timeSinceLastCall < MIN_API_INTERVAL) {
    await delay(MIN_API_INTERVAL - timeSinceLastCall);
  }
  lastApiCall = Date.now();

  // Retry logic
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url, {
        timeout: 10000, // 10 second timeout
        headers: {
          'Accept': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      console.error(`API call attempt ${i + 1} failed:`, error.message);
      
      if (i === retries - 1) {
        throw error; // Last retry failed
      }
      
      // Exponential backoff
      await delay(1000 * Math.pow(2, i));
    }
  }
};

const getAllCurrencies = async (vsCurrency) => {
  const apiLink1 = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vsCurrency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;
  return await makeApiCall(apiLink1);
}

const getAllExchanges = async() =>{
  const apiLink2 = `https://api.coingecko.com/api/v3/exchanges`;
  return await makeApiCall(apiLink2);
}

const getAllNews = async() =>{
  const options = {
    method: 'GET',
    url: 'https://crypto-news16.p.rapidapi.com/news/top/20',
    headers: {
      'X-RapidAPI-Key': import.meta.env.VITE_API_KEY,
      'X-RapidAPI-Host': import.meta.env.VITE_API_HOST
    }
  };
  
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// New functions for enhanced features
const getCoinDetails = async (coinId) => {
  const apiLink = `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
  return await makeApiCall(apiLink);
}

const getCoinHistory = async (coinId, vsCurrency, days) => {
  const apiLink = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${vsCurrency}&days=${days}`;
  return await makeApiCall(apiLink);
}

const searchCoins = async (query) => {
  const apiLink = `https://api.coingecko.com/api/v3/search?query=${query}`;
  return await makeApiCall(apiLink);
}

export { 
  getAllCurrencies, 
  getAllExchanges, 
  getAllNews, 
  getCoinDetails, 
  getCoinHistory,
  searchCoins
};