import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import Home from './pages/Home';
import Market from './pages/Market';
import CoinDetail from './pages/CoinDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Portfolio from './pages/Portfolio';
import PrivateRoute from './components/PrivateRoute';
import News from './pages/News';

// Create AppContext
export const AppContext = createContext();

function App() {
  const [vsCurrency, setVsCurrency] = useState('usd');
  const [watchlist, setWatchlist] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Load saved data from localStorage
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('watchlist');
    const savedAlerts = localStorage.getItem('priceAlerts');
    const savedCurrency = localStorage.getItem('vsCurrency');

    if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
    if (savedAlerts) setAlerts(JSON.parse(savedAlerts));
    if (savedCurrency) setVsCurrency(savedCurrency);
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    localStorage.setItem('priceAlerts', JSON.stringify(alerts));
    localStorage.setItem('vsCurrency', vsCurrency);
    console.log("Currency changed to:", vsCurrency); // Add logging
  }, [watchlist, alerts, vsCurrency]);

  // Currency change handler with additional logging
  const handleCurrencyChange = (newCurrency) => {
    console.log("Setting currency to:", newCurrency);
    setVsCurrency(newCurrency);
  };

  // Add coin to watchlist
  const addToWatchlist = (coin) => {
    if (!watchlist.some(item => item.id === coin.id)) {
      setWatchlist([...watchlist, coin]);
    }
  };

  // Remove coin from watchlist
  const removeFromWatchlist = (coinId) => {
    setWatchlist(watchlist.filter(coin => coin.id !== coinId));
  };

  // Add price alert
  const addAlert = (alert) => {
    setAlerts([...alerts, { ...alert, id: Date.now() }]);
  };

  // Remove price alert
  const removeAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const contextValue = {
    vsCurrency,
    setVsCurrency: handleCurrencyChange, // Use the handler with logging
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    alerts,
    addAlert,
    removeAlert
  };

  return (
    <AppContext.Provider value={contextValue}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/market" element={<Market />} />
            <Route path="/coin/:coinId" element={<CoinDetail />} />
            <Route path="/news" element={<News />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/portfolio" 
              element={
                <PrivateRoute>
                  <Portfolio />
                </PrivateRoute>
              } 
            />
          </Routes>
        </AuthProvider>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
