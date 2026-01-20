import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { AppContext } from '../App';
import { Icons } from '../components/Icons';
import axios from 'axios';

const Market = () => {
  const [page, setPage] = useState(1);
  const { vsCurrency } = useContext(AppContext);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Currency symbol mapping
  const currencySymbols = {
    usd: '$',
    eur: '€',
    gbp: '£',
    jpy: '¥',
    inr: '₹'
  };

  const currencySymbol = currencySymbols[vsCurrency] || '$';

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
          params: {
            vs_currency: vsCurrency,
            order: 'market_cap_desc',
            per_page: 20,
            page: page,
            sparkline: false,
            price_change_percentage: '24h'
          },
          timeout: 10000 // 10 second timeout
        });
        
        setCoins(response.data);
        setRetryCount(0); // Reset retry count on success
      } catch (err) {
        console.error('Error fetching market data:', err);
        
        if (retryCount < 3) {
          // Retry up to 3 times with increasing delay
          setRetryCount(prev => prev + 1);
          setError(`Network error. Retrying... (${retryCount + 1}/3)`);
          setTimeout(() => fetchCoins(), 2000 * (retryCount + 1));
        } else {
          setError('Network Error: Unable to fetch market data. The CoinGecko API may be experiencing high traffic or rate limiting. Please try again later.');
        }
      } finally {
        if (retryCount >= 3 || !error) {
          setLoading(false);
        }
      }
    };

    fetchCoins();
  }, [vsCurrency, page]);

  const handleRetry = () => {
    setRetryCount(0);
    setLoading(true);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-crypto-dark text-white">
      {/* Background decorations */}
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="fixed top-20 right-1/4 w-96 h-96 bg-crypto-purple/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-1/4 w-96 h-96 bg-crypto-accent/5 rounded-full blur-3xl pointer-events-none" />
      
      <Navbar />
      <div className="container mx-auto px-4 py-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-12 h-12 rounded-xl bg-crypto-purple/20 flex items-center justify-center">
            <Icons.Chart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-days font-bold">Cryptocurrency Market</h1>
            <p className="text-gray-400">Real-time prices and market data</p>
          </div>
        </motion.div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card border-crypto-warning/30 p-4 mb-6"
          >
            <p className="text-crypto-warning">{error}</p>
            {retryCount >= 3 && (
              <button 
                onClick={handleRetry}
                className="mt-2 btn-primary text-sm px-4 py-2"
              >
                Try Again
              </button>
            )}
          </motion.div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            {coins && coins.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card overflow-hidden"
              >
                <table className="crypto-table">
                  <thead>
                    <tr>
                      <th className="text-center w-16">#</th>
                      <th>Coin</th>
                      <th className="text-right">Price</th>
                      <th className="text-right">24h Change</th>
                      <th className="text-right hidden md:table-cell">24h Volume</th>
                      <th className="text-right hidden lg:table-cell">Market Cap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coins.map((coin, index) => (
                      <motion.tr 
                        key={coin.id} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="group"
                      >
                        <td className="text-center text-gray-500 font-medium">
                          {coin.market_cap_rank}
                        </td>
                        <td>
                          <Link to={`/coin/${coin.id}`} className="flex items-center gap-3">
                            <div className="relative">
                              <img 
                                src={coin.image} 
                                alt={coin.name} 
                                className="w-10 h-10 rounded-full"
                              />
                              <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div>
                              <div className="font-semibold group-hover:text-crypto-purple transition-colors">
                                {coin.name}
                              </div>
                              <div className="text-gray-500 text-sm">{coin.symbol.toUpperCase()}</div>
                            </div>
                          </Link>
                        </td>
                        <td className="text-right font-medium">
                          {currencySymbol}{coin.current_price?.toLocaleString() || '0.00'}
                        </td>
                        <td className="text-right">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium ${
                            coin.price_change_percentage_24h > 0 
                              ? 'bg-crypto-accent/10 text-crypto-accent' 
                              : 'bg-crypto-warning/10 text-crypto-warning'
                          }`}>
                            {coin.price_change_percentage_24h > 0 
                              ? <Icons.TrendingUp className="w-3 h-3" />
                              : <Icons.TrendingDown className="w-3 h-3" />
                            }
                            {coin.price_change_percentage_24h > 0 ? '+' : ''}
                            {coin.price_change_percentage_24h?.toFixed(2) || '0.00'}%
                          </span>
                        </td>
                        <td className="text-right hidden md:table-cell text-gray-400">
                          {currencySymbol}{coin.total_volume?.toLocaleString() || '0'}
                        </td>
                        <td className="text-right hidden lg:table-cell text-gray-400">
                          {currencySymbol}{coin.market_cap?.toLocaleString() || '0'}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 glass-card"
              >
                <Icons.Chart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl font-semibold mb-2">No data available</p>
                <p className="text-gray-400 mb-6">Unable to load cryptocurrency data at this time.</p>
                <button 
                  onClick={handleRetry}
                  className="btn-primary"
                >
                  Refresh Data
                </button>
              </motion.div>
            )}
            
            {/* Pagination */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex justify-center items-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  page === 1 
                    ? 'bg-white/5 text-gray-500 cursor-not-allowed' 
                    : 'btn-secondary'
                }`}
              >
                Previous
              </motion.button>
              <span className="px-6 py-3 glass-card font-medium">
                Page {page}
              </span>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPage(prev => prev + 1)}
                className="btn-primary"
              >
                Next
              </motion.button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Market;