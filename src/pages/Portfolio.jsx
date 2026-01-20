import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from "../App";
import Navbar from '../components/Navbar';
import { getAllCurrencies } from "../context/coinContext";
import { Icons } from '../components/Icons';
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

  // Calculate stats
  const totalInvestment = portfolio.reduce((total, item) => total + (item.purchasePrice * item.amount), 0);
  const profitLoss = totalValue - totalInvestment;
  const percentChange = totalInvestment > 0 ? ((totalValue - totalInvestment) / totalInvestment) * 100 : 0;

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
          className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-crypto-purple/20 flex items-center justify-center">
              <Icons.Wallet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-days font-bold">Your Portfolio</h1>
              <p className="text-gray-400">Track your crypto investments</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddCoin}
            className="btn-primary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Coin
          </motion.button>
        </motion.div>

        {portfolio.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-12 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-crypto-purple/20 flex items-center justify-center mx-auto mb-6">
              <Icons.Wallet className="w-10 h-10 opacity-50" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Your portfolio is empty</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Start tracking your crypto investments by adding coins to your portfolio.
            </p>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddCoin}
              className="btn-primary"
            >
              Add Your First Coin
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-crypto-purple/20 flex items-center justify-center">
                    <Icons.Chart className="w-5 h-5" />
                  </div>
                  <span className="text-gray-400 font-medium">Portfolio Value</span>
                </div>
                <p className="text-3xl font-bold">${totalValue.toLocaleString()}</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-crypto-accent/20 flex items-center justify-center">
                    <Icons.Wallet className="w-5 h-5" />
                  </div>
                  <span className="text-gray-400 font-medium">Total Invested</span>
                </div>
                <p className="text-3xl font-bold">${totalInvestment.toLocaleString()}</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    profitLoss >= 0 ? 'bg-crypto-accent/20' : 'bg-crypto-warning/20'
                  }`}>
                    {profitLoss >= 0 
                      ? <Icons.TrendingUp className="w-5 h-5" />
                      : <Icons.TrendingDown className="w-5 h-5" />
                    }
                  </div>
                  <span className="text-gray-400 font-medium">Profit/Loss</span>
                </div>
                <p className={`text-3xl font-bold ${profitLoss >= 0 ? 'text-crypto-accent' : 'text-crypto-warning'}`}>
                  {profitLoss >= 0 ? '+' : ''}{profitLoss.toLocaleString()} 
                  <span className="text-lg ml-2">({percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}%)</span>
                </p>
              </motion.div>
            </div>

            {/* Holdings Table */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass-card overflow-hidden mb-8"
            >
              <table className="crypto-table">
                <thead>
                  <tr>
                    <th>Coin</th>
                    <th className="text-right">Holdings</th>
                    <th className="text-right hidden md:table-cell">Avg Buy</th>
                    <th className="text-right hidden md:table-cell">Current</th>
                    <th className="text-right">P/L</th>
                    <th className="text-center w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.map((item, index) => {
                    const coin = coins.find(c => c.id === item.coinId);
                    const percentChange = getPercentageChange(item);
                    
                    return coin ? (
                      <motion.tr 
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group"
                      >
                        <td>
                          <div className="flex items-center gap-3">
                            <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full" />
                            <div>
                              <div className="font-semibold">{coin.name}</div>
                              <div className="text-gray-500 text-sm">{coin.symbol.toUpperCase()}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-right">
                          <div className="font-medium">{item.amount} {coin.symbol.toUpperCase()}</div>
                          <div className="text-gray-500 text-sm">${(item.amount * coin.current_price).toLocaleString()}</div>
                        </td>
                        <td className="text-right hidden md:table-cell">
                          ${item.purchasePrice?.toLocaleString()}
                        </td>
                        <td className="text-right hidden md:table-cell">
                          ${coin.current_price.toLocaleString()}
                        </td>
                        <td className="text-right">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium ${
                            percentChange >= 0 
                              ? 'bg-crypto-accent/10 text-crypto-accent' 
                              : 'bg-crypto-warning/10 text-crypto-warning'
                          }`}>
                            {percentChange >= 0 
                              ? <Icons.TrendingUp className="w-3 h-3" />
                              : <Icons.TrendingDown className="w-3 h-3" />
                            }
                            {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}%
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleEditCoin(item)}
                              className="p-2 rounded-lg bg-white/5 hover:bg-crypto-purple/20 text-gray-400 hover:text-crypto-purple transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleDeleteCoin(item.id)}
                              className="p-2 rounded-lg bg-white/5 hover:bg-crypto-warning/20 text-gray-400 hover:text-crypto-warning transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ) : null;
                  })}
                </tbody>
              </table>
            </motion.div>
            
            {/* Portfolio Distribution */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6 mb-8"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icons.Chart className="w-5 h-5" />
                Portfolio Distribution
              </h3>
              <div className="flex flex-wrap gap-3">
                {portfolio.map(item => {
                  const coin = coins.find(c => c.id === item.coinId);
                  if (!coin) return null;
                  
                  const value = coin.current_price * item.amount;
                  const percentage = (value / totalValue) * 100;
                  
                  return (
                    <motion.div 
                      key={item.id} 
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2"
                    >
                      <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                      <span className="font-medium">{coin.symbol.toUpperCase()}</span>
                      <span className="text-crypto-purple font-semibold">{percentage.toFixed(1)}%</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
            
            {/* Price Alerts Section */}
            <PriceAlerts />
          </>
        )}
      </div>

      {/* Add Coin Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-crypto-purple/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-crypto-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold">Add Coin</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Select Coin</label>
                  <select 
                    value={formData.coinId}
                    onChange={(e) => setFormData({...formData, coinId: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-crypto-purple/50 focus:ring-2 focus:ring-crypto-purple/20"
                    required
                  >
                    <option value="" className="bg-crypto-dark">Select a coin</option>
                    {coins.map(coin => (
                      <option key={coin.id} value={coin.id} className="bg-crypto-dark">
                        {coin.name} ({coin.symbol.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Amount</label>
                  <input 
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-crypto-purple/50 focus:ring-2 focus:ring-crypto-purple/20"
                    placeholder="0.00"
                    step="any"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Purchase Price (per coin)</label>
                  <input 
                    type="number"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-crypto-purple/50 focus:ring-2 focus:ring-crypto-purple/20"
                    placeholder="0.00"
                    step="any"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Purchase Date</label>
                  <input 
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-crypto-purple/50 focus:ring-2 focus:ring-crypto-purple/20"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    Add Coin
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Coin Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsEditModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-crypto-purple/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-crypto-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold">Edit Coin</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Coin</label>
                  <select 
                    value={formData.coinId}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white opacity-50"
                    disabled
                  >
                    {coins.map(coin => (
                      <option key={coin.id} value={coin.id} className="bg-crypto-dark">
                        {coin.name} ({coin.symbol.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Amount</label>
                  <input 
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-crypto-purple/50 focus:ring-2 focus:ring-crypto-purple/20"
                    placeholder="0.00"
                    step="any"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Purchase Price (per coin)</label>
                  <input 
                    type="number"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-crypto-purple/50 focus:ring-2 focus:ring-crypto-purple/20"
                    placeholder="0.00"
                    step="any"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Purchase Date</label>
                  <input 
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-crypto-purple/50 focus:ring-2 focus:ring-crypto-purple/20"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;