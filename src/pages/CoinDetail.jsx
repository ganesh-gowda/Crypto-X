import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCoinDetails, fetchChartData } from '../services/api';
import Navbar from '../components/Navbar';
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
} from 'chart.js';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
// Removing the AppContext import since it doesn't exist

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
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
          backgroundColor: 'rgba(136, 106, 255, 0.2)',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          tension: 0.1,
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
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-crypto-purple"></div>
        </div>
      </div>
    );
  }

  if (!coinData) {
    return (
      <div className="min-h-screen bg-crypto-dark text-white">
        <Navbar />
        <div className="text-center text-2xl mt-20">
          Coin data not found
        </div>
      </div>
    );
  }

  const priceChangeColor = coinData.market_data.price_change_percentage_24h >= 0 
    ? 'text-crypto-accent' 
    : 'text-crypto-warning';

  return (
    <div className="min-h-screen bg-crypto-dark text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img src={coinData.image.large} alt={coinData.name} className="w-16 h-16" />
            <div>
              <h1 className="text-3xl font-days font-bold">{coinData.name} <span className="text-gray-400">({coinData.symbol.toUpperCase()})</span></h1>
              <div className="text-lg text-gray-400">Rank #{coinData.market_cap_rank}</div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="text-3xl font-bold">${coinData.market_data.current_price[vsCurrency].toLocaleString()}</div>
            <div className={`flex items-center ${priceChangeColor}`}>
              {coinData.market_data.price_change_percentage_24h >= 0 ? 
                <FaArrowUp className="mr-1" /> : 
                <FaArrowDown className="mr-1" />}
              {Math.abs(coinData.market_data.price_change_percentage_24h).toFixed(2)}% (24h)
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-card">
          <div className="flex justify-end mb-4">
            <div className="flex bg-gray-700 rounded-lg p-1">
              {timeframeOptions.map(option => (
                <button
                  key={option.value}
                  className={`px-4 py-2 rounded-lg ${timeframe === option.value ? 'bg-crypto-purple text-white' : 'text-gray-400'}`}
                  onClick={() => setTimeframe(option.value)}
                >
                  {option.label}
                </button>
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
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false,
                        color: 'rgba(255, 255, 255, 0.1)',
                      },
                      ticks: {
                        color: 'rgba(255, 255, 255, 0.5)',
                        maxTicksLimit: 8,
                      },
                    },
                    y: {
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                      },
                      ticks: {
                        color: 'rgba(255, 255, 255, 0.5)',
                        callback: function(value) {
                          return '$' + value.toLocaleString();
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          ) : (
            <div className="h-[400px] flex justify-center items-center">
              <p>Chart data not available</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 shadow-card">
            <h2 className="text-xl font-semibold mb-4">Market Cap</h2>
            <p className="text-2xl font-bold">${coinData.market_data.market_cap[vsCurrency].toLocaleString()}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 shadow-card">
            <h2 className="text-xl font-semibold mb-4">24h Trading Volume</h2>
            <p className="text-2xl font-bold">${coinData.market_data.total_volume[vsCurrency].toLocaleString()}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 shadow-card">
            <h2 className="text-xl font-semibold mb-4">Circulating Supply</h2>
            <p className="text-2xl font-bold">{coinData.market_data.circulating_supply.toLocaleString()} {coinData.symbol.toUpperCase()}</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-card">
          <h2 className="text-2xl font-semibold mb-4">About {coinData.name}</h2>
          <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: coinData.description.en }}></div>
        </div>
      </div>
    </div>
  );
};

export default CoinDetail;

// Remove this duplicate function and API_KEY definition
// The imported fetchCoinDetails from '../services/api' should be used instead