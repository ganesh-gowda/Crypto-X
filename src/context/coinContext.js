import axios from 'axios';

const getAllCurrencies = async (vsCurrency) => {
  const apiLink1 = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vsCurrency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;
  const response = await axios.get(apiLink1);
  return response.data;
}

const getAllExchanges = async() =>{
  const apiLink2 = `https://api.coingecko.com/api/v3/exchanges`;
  const response = await axios.get(apiLink2);
  return response.data;
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
  const response = await axios.get(apiLink);
  return response.data;
}

const getCoinHistory = async (coinId, vsCurrency, days) => {
  const apiLink = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${vsCurrency}&days=${days}`;
  const response = await axios.get(apiLink);
  return response.data;
}

const searchCoins = async (query) => {
  const apiLink = `https://api.coingecko.com/api/v3/search?query=${query}`;
  const response = await axios.get(apiLink);
  return response.data;
}

export { 
  getAllCurrencies, 
  getAllExchanges, 
  getAllNews, 
  getCoinDetails, 
  getCoinHistory,
  searchCoins
};