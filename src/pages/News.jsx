import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { Icons } from '../components/Icons';

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

  const filters = [
    { id: 'all', label: 'All News' },
    { id: 'bitcoin', label: 'Bitcoin' },
    { id: 'ethereum', label: 'Ethereum' },
    { id: 'defi', label: 'DeFi' },
    { id: 'bullish', label: 'Bullish' },
    { id: 'bearish', label: 'Bearish' },
  ];

  return (
    <div className="min-h-screen bg-crypto-dark text-white">
      {/* Background decorations */}
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="fixed top-20 left-1/4 w-96 h-96 bg-crypto-purple/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-1/4 w-96 h-96 bg-crypto-accent/5 rounded-full blur-3xl pointer-events-none" />
      
      <Navbar />
      <div className="container mx-auto px-4 py-8 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-crypto-purple/20 flex items-center justify-center">
              <Icons.Globe className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-days font-bold">Crypto News</h1>
              <p className="text-gray-400">Latest updates from the crypto world</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRefresh} 
            className="btn-secondary flex items-center gap-2"
            disabled={loading}
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </motion.button>
        </motion.div>
        
        {/* Filter options */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {filters.map((f) => (
            <motion.button 
              key={f.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFilterChange(f.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f.id 
                  ? 'bg-crypto-purple text-white shadow-lg shadow-crypto-purple/30' 
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:border-crypto-purple/30'
              }`}
            >
              {f.label}
            </motion.button>
          ))}
        </motion.div>
        
        {lastUpdated && (
          <p className="text-sm text-gray-500 mb-6">
            Last updated: {lastUpdated.toLocaleString()}
          </p>
        )}
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card border-crypto-warning/30 p-4 mb-6"
          >
            <p className="text-crypto-warning">{error}</p>
          </motion.div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card-hover overflow-hidden group"
              >
                {item.imageUrl && (
                  <div className="h-48 bg-crypto-dark-lighter overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                )}
                <div className="p-5">
                  <h2 className="text-lg font-semibold mb-3 line-clamp-2 group-hover:text-crypto-purple transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <div className="text-sm text-gray-500">
                      <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>{item.source}</span>
                    </div>
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-crypto-purple hover:text-crypto-purple-light font-medium text-sm transition-colors"
                    >
                      Read
                      <Icons.ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;