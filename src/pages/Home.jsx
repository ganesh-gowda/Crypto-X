import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AppContext } from "../App";
import { useCryptoData } from '../hooks/useCryptoData';

const Home = () =>
   {
  const { vsCurrency } = useContext(AppContext);
  const { data: trendingCoins, loading: trendingLoading } = useCryptoData('/coins/markets', {
    per_page: 10,
    page: 1,
    sparkline: false,
    price_change_percentage: '24h'
  });

  // Currency symbol mapping
  const currencySymbols = {
    usd: '$',
    eur: '€',
    gbp: '£',
    jpy: '¥',
    inr: '₹'
  };

  const currencySymbol = currencySymbols[vsCurrency] || '$';

  return (
    <div className="min-h-screen bg-crypto-dark text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-days font-bold mb-4">
            Track and Manage Your <span className="text-crypto-purple">Crypto Portfolio</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Real-time cryptocurrency prices, portfolio tracking, and market insights
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/market"
              className="bg-crypto-purple hover:bg-opacity-90 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Explore Market
            </Link>
            <Link
              to="/signup"
              className="bg-transparent border-2 border-crypto-purple hover:bg-crypto-purple hover:bg-opacity-20 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Trending Coins Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-days font-bold mb-6">Trending Cryptocurrencies</h2>
          
          {trendingLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-crypto-purple"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-800 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Coin</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">24h Change</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Market Cap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {trendingCoins && trendingCoins.map((coin) => (
                    <tr key={coin.id} className="hover:bg-gray-700 transition-colors">
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
                        {currencySymbol}{coin.market_cap?.toLocaleString() || '0'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <Link
              to="/market"
              className="text-crypto-purple hover:text-crypto-accent transition-colors font-medium"
            >
              View All Cryptocurrencies →
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-800 p-6 rounded-xl shadow-card">
            <div className="text-crypto-purple text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Real-Time Tracking</h3>
            <p className="text-gray-300">
              Monitor cryptocurrency prices and market movements in real-time with accurate data.
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl shadow-card">
            <div className="text-crypto-purple text-4xl mb-4">💼</div>
            <h3 className="text-xl font-bold mb-2">Portfolio Management</h3>
            <p className="text-gray-300">
              Track your crypto holdings, analyze performance, and manage your investments.
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl shadow-card">
            <div className="text-crypto-purple text-4xl mb-4">🔔</div>
            <h3 className="text-xl font-bold mb-2">Price Alerts</h3>
            <p className="text-gray-300">
              Set custom price alerts and get notified when cryptocurrencies hit your target prices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;