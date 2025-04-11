import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from "../App";
import { getAllCurrencies } from "../context/coinContext";
import { FaBell, FaTrash, FaPlus } from 'react-icons/fa';

const PriceAlerts = () => {
  const { vsCurrency } = useContext(AppContext);
  const [coins, setCoins] = useState([]);
  const [alerts, setAlerts] = useState(() => {
    const savedAlerts = localStorage.getItem('cryptoXAlerts');
    return savedAlerts ? JSON.parse(savedAlerts) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    coinId: '',
    targetPrice: '',
    condition: 'above', // 'above' or 'below'
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
    localStorage.setItem('cryptoXAlerts', JSON.stringify(alerts));
    
    // Check for triggered alerts
    if (coins.length > 0 && alerts.length > 0) {
      checkAlerts();
    }
  }, [alerts, coins]);

  const checkAlerts = () => {
    alerts.forEach(alert => {
      const coin = coins.find(c => c.id === alert.coinId);
      if (!coin) return;
      
      const isTriggered = 
        (alert.condition === 'above' && coin.current_price >= alert.targetPrice) ||
        (alert.condition === 'below' && coin.current_price <= alert.targetPrice);
      
      if (isTriggered && !alert.triggered) {
        // In a real app, you would send a notification here
        // For now, we'll just mark it as triggered
        setAlerts(prevAlerts => 
          prevAlerts.map(a => 
            a.id === alert.id ? { ...a, triggered: true } : a
          )
        );
        
        // Show browser notification if supported
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`${coin.name} Price Alert`, {
            body: `${coin.name} is now ${alert.condition} $${alert.targetPrice}`,
            icon: coin.image
          });
        }
      }
    });
  };

  const handleAddAlert = () => {
    setFormData({
      coinId: '',
      targetPrice: '',
      condition: 'above',
    });
    setIsModalOpen(true);
  };

  const handleDeleteAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newAlert = {
      ...formData,
      id: Date.now().toString(),
      targetPrice: parseFloat(formData.targetPrice),
      triggered: false,
      createdAt: new Date().toISOString(),
    };
    
    setAlerts([...alerts, newAlert]);
    setIsModalOpen(false);
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-days font-bold">Price Alerts</h2>
        <button 
          onClick={handleAddAlert}
          className="bg-crypto-purple hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> Add Alert
        </button>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <FaBell className="mx-auto text-gray-500 mb-4" size={32} />
          <h3 className="text-xl mb-2">No price alerts set</h3>
          <p className="text-gray-400 mb-4">Get notified when coin prices reach your target.</p>
          <button 
            onClick={handleAddAlert}
            className="bg-crypto-purple hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Set Your First Alert
          </button>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Coin</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Condition</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Target Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Current Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {alerts.map(alert => {
                  const coin = coins.find(c => c.id === alert.coinId);
                  if (!coin) return null;
                  
                  const isTriggered = 
                    (alert.condition === 'above' && coin.current_price >= alert.targetPrice) ||
                    (alert.condition === 'below' && coin.current_price <= alert.targetPrice);
                  
                  return (
                    <tr key={alert.id}>
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
                        {alert.condition === 'above' ? 'Price above' : 'Price below'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${alert.targetPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${coin.current_price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {alert.triggered || isTriggered ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-crypto-accent bg-opacity-20 text-crypto-accent">
                            Triggered
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-600 bg-opacity-20 text-gray-300">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => handleDeleteAlert(alert.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <FaTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Alert Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add Price Alert</h2>
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
                <label className="block text-gray-300 mb-2">Condition</label>
                <div className="flex">
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 rounded-l-lg ${formData.condition === 'above' ? 'bg-crypto-purple text-white' : 'bg-gray-700 text-gray-300'}`}
                    onClick={() => setFormData({...formData, condition: 'above'})}
                  >
                    Above
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 rounded-r-lg ${formData.condition === 'below' ? 'bg-crypto-purple text-white' : 'bg-gray-700 text-gray-300'}`}
                    onClick={() => setFormData({...formData, condition: 'below'})}
                  >
                    Below
                  </button>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Target Price</label>
                <input 
                  type="number"
                  value={formData.targetPrice}
                  onChange={(e) => setFormData({...formData, targetPrice: e.target.value})}
                  className="w-full bg-gray-700 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-crypto-purple"
                  placeholder="0.00"
                  step="any"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-crypto-purple hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg"
                  onClick={requestNotificationPermission}
                >
                  Add Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceAlerts;