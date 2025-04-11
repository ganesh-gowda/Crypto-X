import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AppContext } from '../App';
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
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-days font-bold mb-8">Cryptocurrency Market</h1>
        
        {error && (
          <div className="bg-red-500 bg-opacity-20 text-red-400 p-4 rounded-lg mb-6">
            <p>{error}</p>
            {retryCount >= 3 && (
              <button 
                onClick={handleRetry}
                className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Try Again
              </button>
            )}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-crypto-purple"></div>
          </div>
        ) : (
          <>
            {coins && coins.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Coin</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">24h Change</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">24h Volume</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Market Cap</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {coins.map((coin) => (
                      <tr key={coin.id} className="hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {coin.market_cap_rank}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link to={`/coin/${coin.id}`} className="flex items-center">
                            <img src={coin.image} alt={coin.name} className="w-8 h-8 mr-3" />
                            <div>
                              <div className="font-medium">{coin.name}</div>
                              <div className="text-gray-400 text-sm">{coin.symbol.toUpperCase()}</div>
                            </div>
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          {currencySymbol}{coin.current_price?.toLocaleString() || '0.00'}
                        </td>
                        <td className={`px-6 py-4 text-right whitespace-nowrap ${
                          coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {coin.price_change_percentage_24h > 0 ? '+' : ''}
                          {coin.price_change_percentage_24h?.toFixed(2) || '0.00'}%
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          {currencySymbol}{coin.total_volume?.toLocaleString() || '0'}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          {currencySymbol}{coin.market_cap?.toLocaleString() || '0'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-800 rounded-xl">
                <p className="text-xl mb-4">No data available</p>
                <p className="text-gray-400 mb-6">Unable to load cryptocurrency data at this time.</p>
                <button 
                  onClick={handleRetry}
                  className="bg-crypto-purple hover:bg-opacity-90 text-white px-6 py-2 rounded-lg"
                >
                  Refresh Data
                </button>
              </div>
            )}
            
            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg ${
                  page === 1 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-crypto-purple hover:bg-opacity-90 text-white'
                }`}
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-gray-800 rounded-lg">
                Page {page}
              </span>
              <button
                onClick={() => setPage(prev => prev + 1)}
                className="px-4 py-2 bg-crypto-purple hover:bg-opacity-90 text-white rounded-lg"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Market;