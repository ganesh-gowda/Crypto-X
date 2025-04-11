import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { FaExternalLinkAlt, FaSync, FaFilter } from 'react-icons/fa';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filter, setFilter] = useState('all'); // Default filter
  // Keep your API key in one place at the top of the file
  const API_KEY = "CG-zHwyYtX3PyVChYzVVcY47yvj"; // CoinGecko API key
  
  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      // Using CryptoCompare API for news - it's working well
      const response = await fetch(
        'https://min-api.cryptocompare.com/data/v2/news/?lang=EN'
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("API Response:", data); // For debugging
      
      if (data && data.Data && data.Data.length > 0) {
        let filteredNews = data.Data;
        
        // Apply filtering based on selected filter
        if (filter !== 'all') {
          filteredNews = data.Data.filter(item => {
            const title = item.title.toLowerCase();
            const body = item.body ? item.body.toLowerCase() : '';
            
            if (filter === 'bitcoin') return title.includes('bitcoin') || title.includes('btc');
            if (filter === 'ethereum') return title.includes('ethereum') || title.includes('eth');
            if (filter === 'bullish') return title.includes('bull') || title.includes('rise') || title.includes('up') || title.includes('gain');
            if (filter === 'bearish') return title.includes('bear') || title.includes('fall') || title.includes('down') || title.includes('drop');
            if (filter === 'defi') return title.includes('defi') || body.includes('defi');
            return true;
          });
        }
        
        const formattedNews = filteredNews.map(item => ({
          id: item.id,
          title: item.title,
          description: item.body,
          url: item.url,
          publishedAt: item.published_on * 1000, // Convert to milliseconds
          source: item.source,
          imageUrl: item.imageurl
        }));
        
        setNews(formattedNews);
        setLastUpdated(new Date());
      } else {
        console.log("Empty or invalid data format:", data);
        setNews(sampleNews);
        setError("No news available at the moment. Showing sample news.");
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setError("Failed to load news. Please try again later.");
      // Fallback to sample news if API fails
      setNews(sampleNews);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get default images based on news categories
  const getDefaultImageForCategory = (categories) => {
    if (!categories || categories.length === 0) return "https://via.placeholder.com/400x400?text=Crypto+News";
    
    const category = categories[0].toLowerCase();
    const defaultImages = {
      bitcoin: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=025",
      ethereum: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=025",
      ripple: "https://cryptologos.cc/logos/xrp-xrp-logo.png?v=025",
      solana: "https://cryptologos.cc/logos/solana-sol-logo.png?v=025",
      cardano: "https://cryptologos.cc/logos/cardano-ada-logo.png?v=025",
      defi: "https://via.placeholder.com/400x400?text=DeFi+News",
      nft: "https://via.placeholder.com/400x400?text=NFT+News",
    };
    
    if (category.includes('bitcoin')) return defaultImages.bitcoin;
    if (category.includes('ethereum')) return defaultImages.ethereum;
    if (category.includes('ripple') || category.includes('xrp')) return defaultImages.ripple;
    if (category.includes('solana')) return defaultImages.solana;
    if (category.includes('cardano')) return defaultImages.cardano;
    if (category.includes('defi')) return defaultImages.defi;
    if (category.includes('nft')) return defaultImages.nft;
    
    return "https://via.placeholder.com/400x400?text=Crypto+News";
  };

  useEffect(() => {
    fetchNews();
    
    // Set up auto-refresh every 5 minutes
    const refreshInterval = setInterval(fetchNews, 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [filter]); // Re-fetch when filter changes

  // Sample news data as fallback
  const sampleNews = [
    // Your existing sample news items
  ];

  const handleRefresh = () => {
    fetchNews();
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="min-h-screen bg-crypto-dark">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-days font-bold">Crypto News</h1>
          <button 
            onClick={handleRefresh} 
            className="flex items-center bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
            disabled={loading}
          >
            <FaSync className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
        <p className="text-gray-400 mb-2">
          Stay updated with the latest happenings in the cryptocurrency world. Our news section brings you the most recent developments, market trends, and insights from the crypto space.
        </p>
        
        {/* Filter options */}
        <div className="flex items-center space-x-2 mb-4">
          <FaFilter className="text-gray-400" />
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => handleFilterChange('all')}
              className={`px-3 py-1 rounded-lg text-sm ${filter === 'all' ? 'bg-crypto-purple text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              All News
            </button>
            <button 
              onClick={() => handleFilterChange('bitcoin')}
              className={`px-3 py-1 rounded-lg text-sm ${filter === 'bitcoin' ? 'bg-crypto-purple text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Bitcoin
            </button>
            <button 
              onClick={() => handleFilterChange('ethereum')}
              className={`px-3 py-1 rounded-lg text-sm ${filter === 'ethereum' ? 'bg-crypto-purple text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Ethereum
            </button>
            <button 
              onClick={() => handleFilterChange('defi')}
              className={`px-3 py-1 rounded-lg text-sm ${filter === 'defi' ? 'bg-crypto-purple text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              DeFi
            </button>
            <button 
              onClick={() => handleFilterChange('bullish')}
              className={`px-3 py-1 rounded-lg text-sm ${filter === 'bullish' ? 'bg-crypto-purple text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Bullish
            </button>
            <button 
              onClick={() => handleFilterChange('bearish')}
              className={`px-3 py-1 rounded-lg text-sm ${filter === 'bearish' ? 'bg-crypto-purple text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Bearish
            </button>
          </div>
        </div>
        
        {lastUpdated && (
          <p className="text-sm text-gray-500 mb-6">
            Last updated: {lastUpdated.toLocaleString()}
          </p>
        )}
        
        {error && (
          <div className="bg-red-500 bg-opacity-20 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-crypto-purple"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map(item => (
              <div key={item.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-shadow">
                {item.imageUrl && (
                  <div className="h-48 bg-gray-700 flex items-center justify-center">
                    <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                  <p className="text-gray-400 mb-4 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical'}}>
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-500">{new Date(item.publishedAt).toLocaleDateString()}</span>
                      <span className="text-sm text-gray-500 ml-2">• {item.source}</span>
                    </div>
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-crypto-purple hover:text-purple-400"
                    >
                      Read more <FaExternalLinkAlt className="ml-1" size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;