import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from "../App";
import Navbar from '../components/Navbar';
import { getAllCurrencies } from "../context/coinContext";
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import PriceAlerts from '../components/PriceAlerts';

const Portfolio = () => {
  const { vsCurrency, theme } = useContext(AppContext);
  const [coins, setCoins] = useState([]);
  const [portfolio, setPortfolio] = useState(() => {
    const savedPortfolio = localStorage.getItem('cryptoXPortfolio');
    return savedPortfolio ? JSON.parse(savedPortfolio) : [];
  });
  const [totalValue, setTotalValue] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [formData, setFormData] = useState({
    coinId: '',
    amount: '',
    purchasePrice: '',
    purchaseDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const data = await getAllCurrencies(vsCurrency);
        setCoins(data);
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    };
    
    fetchCoins();
  }, [vsCurrency]);

  useEffect(() => {
    localStorage.setItem('cryptoXPortfolio', JSON.stringify(portfolio));
    
    if (coins.length > 0 && portfolio.length > 0) {
      calculateTotalValue();
    }
  }, [portfolio, coins, vsCurrency]);

  const calculateTotalValue = () => {
    let total = 0;
    
    portfolio.forEach(item => {
      const coin = coins.find(c => c.id === item.coinId);
      if (coin) {
        total += coin.current_price * item.amount;
      }
    });
    
    setTotalValue(total);
  };

  const handleAddCoin = () => {
    setFormData({
      coinId: '',
      amount: '',
      purchasePrice: '',
      purchaseDate: new Date().toISOString().split('T')[0]
    });
    setIsAddModalOpen(true);
  };

  const handleEditCoin = (item) => {
    setSelectedCoin(item);
    setFormData({
      coinId: item.coinId,
      amount: item.amount,
      purchasePrice: item.purchasePrice,
      purchaseDate: item.purchaseDate
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteCoin = (coinId) => {
    setPortfolio(portfolio.filter(item => item.id !== coinId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditModalOpen && selectedCoin) {
      setPortfolio(portfolio.map(item => 
        item.id === selectedCoin.id ? { ...formData, id: selectedCoin.id } : item
      ));
      setIsEditModalOpen(false);
    } else {
      const newItem = {
        ...formData,
        id: Date.now().toString(),
        amount: parseFloat(formData.amount),
        purchasePrice: parseFloat(formData.purchasePrice)
      };
      setPortfolio([...portfolio, newItem]);
      setIsAddModalOpen(false);
    }
  };

  const getPercentageChange = (item) => {
    const coin = coins.find(c => c.id === item.coinId);
    if (!coin || !item.purchasePrice) return 0;
    
    return ((coin.current_price - item.purchasePrice) / item.purchasePrice) * 100;
  };

  return (
    <div className="min-h-screen bg-crypto-dark">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-days font-bold">Your Portfolio</h1>
          <button 
            onClick={handleAddCoin}
            className="bg-crypto-purple hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
          >
            <FaPlus className="mr-2" /> Add Coin
          </button>
        </div>

        {portfolio.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <h2 className="text-2xl mb-4">Your portfolio is empty</h2>
            <p className="text-gray-400 mb-6">Start tracking your crypto investments by adding coins to your portfolio.</p>
            <button 
              onClick={handleAddCoin}
              className="bg-crypto-purple hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              Add Your First Coin
            </button>
          </div>
        ) : (
          <>
            <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-card">
              <h2 className="text-xl font-semibold mb-4">Portfolio Value</h2>
              <p className="text-3xl font-bold">${totalValue.toLocaleString()}</p>
            </div>

            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-card">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Coin</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Holdings</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Avg Buy Price</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Current Price</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Profit/Loss</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {portfolio.map(item => {
                      const coin = coins.find(c => c.id === item.coinId);
                      const percentChange = getPercentageChange(item);
                      const profitLossColor = percentChange >= 0 ? 'text-crypto-accent' : 'text-crypto-warning';
                      
                      return coin ? (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img src={coin.image} alt={coin.name} className="w-8 h-8 mr-3" />
                              <div>
                                <div className="font-medium">{coin.name}</div>
                                <div className="text-gray-400">{coin.symbol.toUpperCase()}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">{item.amount} {coin.symbol.toUpperCase()}</div>
                            <div className="text-gray-400">${(item.amount * coin.current_price).toLocaleString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ${item.purchasePrice.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ${coin.current_price.toLocaleString()}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap ${profitLossColor}`}>
                            {percentChange.toFixed(2)}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              onClick={() => handleEditCoin(item)}
                              className="text-indigo-400 hover:text-indigo-300 mr-3"
                            >
                              <FaEdit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteCoin(item.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <FaTrash size={18} />
                            </button>
                          </td>
                        </tr>
                      ) : null;
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Portfolio Performance Summary */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-xl p-6 shadow-card">
                <h3 className="text-lg font-semibold mb-2">Total Investment</h3>
                <p className="text-2xl font-bold">
                  ${portfolio.reduce((total, item) => {
                    return total + (item.purchasePrice * item.amount);
                  }, 0).toLocaleString()}
                </p>
              </div>
              
              <div className="bg-gray-800 rounded-xl p-6 shadow-card">
                <h3 className="text-lg font-semibold mb-2">Total Profit/Loss</h3>
                {(() => {
                  const investment = portfolio.reduce((total, item) => {
                    return total + (item.purchasePrice * item.amount);
                  }, 0);
                  const profitLoss = totalValue - investment;
                  const profitLossColor = profitLoss >= 0 ? 'text-crypto-accent' : 'text-crypto-warning';
                  return (
                    <p className={`text-2xl font-bold ${profitLossColor}`}>
                      {profitLoss >= 0 ? '+' : ''}{profitLoss.toLocaleString()}
                    </p>
                  );
                })()}
              </div>
              
              <div className="bg-gray-800 rounded-xl p-6 shadow-card">
                <h3 className="text-lg font-semibold mb-2">Performance</h3>
                {(() => {
                  const investment = portfolio.reduce((total, item) => {
                    return total + (item.purchasePrice * item.amount);
                  }, 0);
                  const percentChange = investment > 0 ? ((totalValue - investment) / investment) * 100 : 0;
                  const profitLossColor = percentChange >= 0 ? 'text-crypto-accent' : 'text-crypto-warning';
                  return (
                    <p className={`text-2xl font-bold ${profitLossColor}`}>
                      {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}%
                    </p>
                  );
                })()}
              </div>
            </div>
            
            {/* Portfolio Distribution Chart */}
            <div className="mt-8 bg-gray-800 rounded-xl p-6 shadow-card">
              <h3 className="text-xl font-semibold mb-4">Portfolio Distribution</h3>
              <div className="flex flex-wrap gap-2">
                {portfolio.map(item => {
                  const coin = coins.find(c => c.id === item.coinId);
                  if (!coin) return null;
                  
                  const value = coin.current_price * item.amount;
                  const percentage = (value / totalValue) * 100;
                  
                  return (
                    <div 
                      key={item.id} 
                      className="flex items-center bg-gray-700 rounded-full px-3 py-1"
                      style={{ 
                        background: `linear-gradient(90deg, rgba(136, 106, 255, 0.5) ${percentage}%, rgba(64, 64, 64, 0.5) ${percentage}%)` 
                      }}
                    >
                      <img src={coin.image} alt={coin.name} className="w-5 h-5 mr-2" />
                      <span className="mr-2">{coin.symbol.toUpperCase()}</span>
                      <span className="text-sm text-gray-300">{percentage.toFixed(1)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Price Alerts Section */}
            <PriceAlerts />
          </>
        )}
      </div>

      {/* Add Coin Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add Coin</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Select Coin</label>
                <select 
                  value={formData.coinId}
                  onChange={(e) => setFormData({...formData, coinId: e.target.value})}
                  className="w-full bg-gray-700 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-crypto-purple"
                  required
                >
                  <option value="">Select a coin</option>
                  {coins.map(coin => (
                    <option key={coin.id} value={coin.id}>{coin.name} ({coin.symbol.toUpperCase()})</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Amount</label>
                <input 
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full bg-gray-700 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-crypto-purple"
                  placeholder="0.00"
                  step="any"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Purchase Price (per coin)</label>
                <input 
                  type="number"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}
                  className="w-full bg-gray-700 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-crypto-purple"
                  placeholder="0.00"
                  step="any"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Purchase Date</label>
                <input 
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                  className="w-full bg-gray-700 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-crypto-purple"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-crypto-purple hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Add Coin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Coin Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Edit Coin</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Select Coin</label>
                <select 
                  value={formData.coinId}
                  onChange={(e) => setFormData({...formData, coinId: e.target.value})}
                  className="w-full bg-gray-700 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-crypto-purple"
                  required
                  disabled
                >
                  {coins.map(coin => (
                    <option key={coin.id} value={coin.id}>{coin.name} ({coin.symbol.toUpperCase()})</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Amount</label>
                <input 
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full bg-gray-700 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-crypto-purple"
                  placeholder="0.00"
                  step="any"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Purchase Price (per coin)</label>
                <input 
                  type="number"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}
                  className="w-full bg-gray-700 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-crypto-purple"
                  placeholder="0.00"
                  step="any"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Purchase Date</label>
                <input 
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                  className="w-full bg-gray-700 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-crypto-purple"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-crypto-purple hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;