import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from "../App";
import Navbar from '../components/Navbar';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import axios from 'axios';
import { FaChartLine, FaChartPie, FaArrowUp, FaArrowDown, FaTrophy, FaDownload } from 'react-icons/fa';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
  const { vsCurrency } = useContext(AppContext);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/portfolio/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-days font-bold mb-8">Portfolio Analytics</h1>
            <div className="animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-gray-800 rounded-xl p-6 h-32"></div>
                ))}
              </div>
              <div className="bg-gray-800 rounded-xl p-6 h-96 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-xl p-6 h-96"></div>
                <div className="bg-gray-800 rounded-xl p-6 h-96"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!analytics || analytics.totalInvested === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-days font-bold mb-8">Portfolio Analytics</h1>
            <div className="bg-gray-800 rounded-xl p-12 text-center">
              <FaChartLine className="text-6xl text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl mb-4">No Portfolio Data</h2>
              <p className="text-gray-400">Add coins to your portfolio to see analytics.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Chart data preparations
  const performanceChartData = {
    labels: analytics.performanceHistory.map(h => {
      const date = new Date(h.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        label: 'Portfolio Value',
        data: analytics.performanceHistory.map(h => h.value),
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const assetAllocationData = {
    labels: analytics.assetAllocation.map(a => a.coinId.toUpperCase()),
    datasets: [
      {
        data: analytics.assetAllocation.map(a => a.value),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)',
          'rgba(83, 102, 255, 0.8)',
        ],
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 2
      }
    ]
  };

  const plComparisonData = {
    labels: ['Daily', 'Weekly', 'Monthly'],
    datasets: [
      {
        label: 'Profit/Loss',
        data: [analytics.dailyPL, analytics.weeklyPL, analytics.monthlyPL],
        backgroundColor: [
          analytics.dailyPL >= 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)',
          analytics.weeklyPL >= 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)',
          analytics.monthlyPL >= 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)',
        ],
        borderRadius: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: 'white'
        }
      }
    },
    scales: {
      y: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'white'
        }
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-days font-bold">Portfolio Analytics</h1>
            <button
              onClick={() => window.print()}
              className="bg-crypto-purple hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
            >
              <FaDownload className="mr-2" /> Export Report
            </button>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Value */}
            <div className="bg-gradient-to-br from-purple-900 to-purple-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-gray-200 text-sm mb-2">Current Value</h3>
              <p className="text-3xl font-bold mb-1">${analytics.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-sm text-gray-300">Invested: ${analytics.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>

            {/* Total P/L */}
            <div className={`bg-gradient-to-br ${analytics.totalProfitLoss >= 0 ? 'from-green-900 to-green-700' : 'from-red-900 to-red-700'} rounded-xl p-6 shadow-lg`}>
              <h3 className="text-gray-200 text-sm mb-2">Total Profit/Loss</h3>
              <p className="text-3xl font-bold mb-1 flex items-center">
                {analytics.totalProfitLoss >= 0 ? <FaArrowUp className="mr-2" /> : <FaArrowDown className="mr-2" />}
                ${Math.abs(analytics.totalProfitLoss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-gray-300">{analytics.totalProfitLossPercentage.toFixed(2)}%</p>
            </div>

            {/* ROI */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-gray-200 text-sm mb-2">ROI</h3>
              <p className="text-3xl font-bold mb-1">{analytics.roi.toFixed(2)}%</p>
              <p className="text-sm text-gray-300">Win Rate: {analytics.winRate.toFixed(1)}%</p>
            </div>

            {/* Transactions */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-gray-200 text-sm mb-2">Total Transactions</h3>
              <p className="text-3xl font-bold mb-1">{analytics.totalTransactions}</p>
              <p className="text-sm text-gray-300">Profitable: {analytics.profitableHoldings}/{analytics.holdings.length}</p>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FaChartLine className="mr-3 text-crypto-purple" />
              Portfolio Performance (Last 30 Days)
            </h2>
            <div className="h-80">
              <Line data={performanceChartData} options={chartOptions} />
            </div>
          </div>

          {/* P/L Comparison & Asset Allocation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* P/L Comparison */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">P/L Comparison</h2>
              <div className="h-80">
                <Bar data={plComparisonData} options={chartOptions} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-gray-400 text-sm">Daily</p>
                  <p className={`font-bold ${analytics.dailyPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ${analytics.dailyPL.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Weekly</p>
                  <p className={`font-bold ${analytics.weeklyPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ${analytics.weeklyPL.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Monthly</p>
                  <p className={`font-bold ${analytics.monthlyPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ${analytics.monthlyPL.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Asset Allocation */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FaChartPie className="mr-3 text-crypto-purple" />
                Asset Allocation
              </h2>
              <div className="h-80">
                <Pie data={assetAllocationData} options={pieOptions} />
              </div>
            </div>
          </div>

          {/* Best & Worst Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Best Performer */}
            {analytics.bestPerformer && (
              <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <FaTrophy className="mr-3 text-yellow-400" />
                  Best Performer
                </h2>
                <div className="space-y-2">
                  <p className="text-xl font-bold">{analytics.bestPerformer.coinId.toUpperCase()}</p>
                  <p className="text-gray-300">Amount: {analytics.bestPerformer.amount}</p>
                  <p className="text-gray-300">Invested: ${analytics.bestPerformer.invested.toFixed(2)}</p>
                  <p className="text-gray-300">Current Value: ${analytics.bestPerformer.currentValue.toFixed(2)}</p>
                  <p className="text-2xl font-bold text-green-400">
                    +{analytics.bestPerformer.profitLossPercentage.toFixed(2)}%
                  </p>
                  <p className="text-green-400">+${analytics.bestPerformer.profitLoss.toFixed(2)}</p>
                </div>
              </div>
            )}

            {/* Worst Performer */}
            {analytics.worstPerformer && (
              <div className="bg-gradient-to-br from-red-900 to-red-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Worst Performer</h2>
                <div className="space-y-2">
                  <p className="text-xl font-bold">{analytics.worstPerformer.coinId.toUpperCase()}</p>
                  <p className="text-gray-300">Amount: {analytics.worstPerformer.amount}</p>
                  <p className="text-gray-300">Invested: ${analytics.worstPerformer.invested.toFixed(2)}</p>
                  <p className="text-gray-300">Current Value: ${analytics.worstPerformer.currentValue.toFixed(2)}</p>
                  <p className={`text-2xl font-bold ${analytics.worstPerformer.profitLossPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {analytics.worstPerformer.profitLossPercentage >= 0 ? '+' : ''}{analytics.worstPerformer.profitLossPercentage.toFixed(2)}%
                  </p>
                  <p className={analytics.worstPerformer.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {analytics.worstPerformer.profitLoss >= 0 ? '+' : ''}${analytics.worstPerformer.profitLoss.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;
