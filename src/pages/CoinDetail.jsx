import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchCoinDetails, fetchChartData } from '../services/api';
import Navbar from '../components/Navbar';
import { Icons } from '../components/Icons';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const CoinDetail = () => {
  const { coinId } = useParams();
  // Using a default vsCurrency instead of getting it from context
  const vsCurrency = 'usd';
  const [coinData, setCoinData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [timeframe, setTimeframe] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Fetch coin details
        const details = await fetchCoinDetails(coinId);
        setCoinData(details);
        
        // Fetch chart data
        const historyData = await fetchChartData(coinId, timeframe);
        prepareChartData(historyData);
      } catch (error) {
        console.error("Error fetching coin data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [coinId, timeframe]); // Removed vsCurrency from dependencies since it's now a constant

  const prepareChartData = (historyData) => {
    if (!historyData || !historyData.prices) return;

    const chartLabels = historyData.prices.map(price => {
      const date = new Date(price[0]);
      return timeframe === '1d' ? date.toLocaleTimeString() : date.toLocaleDateString();
    });

    const priceData = historyData.prices.map(price => price[1]);

    setChartData({
      labels: chartLabels,
      datasets: [
        {
          label: `Price (${vsCurrency.toUpperCase()})`,
          data: priceData,
          borderColor: '#886AFF',
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(136, 106, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(136, 106, 255, 0)');
            return gradient;
          },
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          tension: 0.4,
          fill: true,
        },
      ],
    });
  };

  const timeframeOptions = [
    { label: '24h', value: '1d' },
    { label: '7d', value: '7d' },
    { label: '30d', value: '30d' },
    { label: '3m', value: '90d' },
    { label: '1y', value: '365d' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-crypto-dark text-white">
        <Navbar />
        <div className="flex justify-center items-center h-[80vh]">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  if (!coinData) {
    return (
      <div className="min-h-screen bg-crypto-dark text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="glass-card p-12 text-center max-w-md mx-auto">
            <Icons.Chart className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold mb-4">Coin not found</h2>
            <p className="text-gray-400 mb-6">The cryptocurrency you're looking for doesn't exist or couldn't be loaded.</p>
            <Link to="/market" className="btn-primary inline-flex items-center gap-2">
              <Icons.ArrowRight className="w-4 h-4 rotate-180" />
              Back to Market
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const priceChange = coinData.market_data.price_change_percentage_24h;
  const isPositive = priceChange >= 0;

  return (
    <div className="min-h-screen bg-crypto-dark text-white">
      {/* Background decorations */}
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="fixed top-20 right-1/4 w-96 h-96 bg-crypto-purple/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-1/4 w-96 h-96 bg-crypto-accent/5 rounded-full blur-3xl pointer-events-none" />
      
      <Navbar />
      <div className="container mx-auto px-4 py-8 relative">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link to="/market" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Market
          </Link>
        </motion.div>

        {/* Coin Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={coinData.image.large} alt={coinData.name} className="w-16 h-16 rounded-2xl" />
              <div className="absolute -bottom-1 -right-1 bg-crypto-dark-lighter px-2 py-0.5 rounded-lg text-xs font-medium border border-white/10">
                #{coinData.market_cap_rank}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-days font-bold flex items-center gap-3">
                {coinData.name} 
                <span className="text-gray-500 text-xl font-normal">{coinData.symbol.toUpperCase()}</span>
              </h1>
            </div>
          </div>
          
          <div className="glass-card px-6 py-4">
            <div className="text-3xl font-bold">
              ${coinData.market_data.current_price[vsCurrency].toLocaleString()}
            </div>
            <div className={`flex items-center gap-2 ${isPositive ? 'text-crypto-accent' : 'text-crypto-warning'}`}>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium ${
                isPositive ? 'bg-crypto-accent/10' : 'bg-crypto-warning/10'
              }`}>
                {isPositive 
                  ? <Icons.TrendingUp className="w-3 h-3" />
                  : <Icons.TrendingDown className="w-3 h-3" />
                }
                {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
              </span>
              <span className="text-gray-400 text-sm">24h</span>
            </div>
          </div>
        </motion.div>

        {/* Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Icons.Chart className="w-5 h-5" />
              Price Chart
            </h2>
            <div className="flex bg-white/5 rounded-xl p-1">
              {timeframeOptions.map(option => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    timeframe === option.value 
                      ? 'bg-crypto-purple text-white shadow-lg shadow-crypto-purple/30' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setTimeframe(option.value)}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </div>
          
          {chartData ? (
            <div className="h-[400px]">
              <Line 
                data={chartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      mode: 'index',
                      intersect: false,
                      backgroundColor: 'rgba(13, 13, 18, 0.9)',
                      borderColor: 'rgba(136, 106, 255, 0.3)',
                      borderWidth: 1,
                      titleColor: '#fff',
                      bodyColor: '#888',
                      padding: 12,
                      cornerRadius: 8,
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false,
                      },
                      ticks: {
                        color: 'rgba(255, 255, 255, 0.4)',
                        maxTicksLimit: 8,
                        font: { size: 11 },
                      },
                      border: {
                        display: false,
                      },
                    },
                    y: {
                      grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                      },
                      ticks: {
                        color: 'rgba(255, 255, 255, 0.4)',
                        font: { size: 11 },
                        callback: function(value) {
                          return '$' + value.toLocaleString();
                        },
                      },
                      border: {
                        display: false,
                      },
                    },
                  },
                  interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false,
                  },
                }}
              />
            </div>
          ) : (
            <div className="h-[400px] flex justify-center items-center">
              <p className="text-gray-400">Chart data not available</p>
            </div>
          )}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-crypto-purple/20 flex items-center justify-center">
                <Icons.Chart className="w-5 h-5" />
              </div>
              <span className="text-gray-400 font-medium">Market Cap</span>
            </div>
            <p className="text-2xl font-bold">${coinData.market_data.market_cap[vsCurrency].toLocaleString()}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-crypto-accent/20 flex items-center justify-center">
                <Icons.Lightning className="w-5 h-5" />
              </div>
              <span className="text-gray-400 font-medium">24h Volume</span>
            </div>
            <p className="text-2xl font-bold">${coinData.market_data.total_volume[vsCurrency].toLocaleString()}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Icons.Globe className="w-5 h-5" />
              </div>
              <span className="text-gray-400 font-medium">Circulating Supply</span>
            </div>
            <p className="text-2xl font-bold">
              {coinData.market_data.circulating_supply.toLocaleString()} 
              <span className="text-gray-500 text-lg ml-1">{coinData.symbol.toUpperCase()}</span>
            </p>
          </motion.div>
        </div>

        {/* About Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Icons.Shield className="w-6 h-6" />
            About {coinData.name}
          </h2>
          <div 
            className="prose prose-invert max-w-none prose-p:text-gray-400 prose-a:text-crypto-purple prose-a:no-underline hover:prose-a:underline prose-strong:text-white" 
            dangerouslySetInnerHTML={{ __html: coinData.description.en || 'No description available.' }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default CoinDetail;