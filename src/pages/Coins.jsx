import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../App";
import { getAllCurrencies } from "../context/coinContext";
import Navbar from "../components/Navbar";

const Coins = () => {
  const { vsCurrency, setVsCurrency } = useContext(AppContext);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currencyChange = (event) => {
    setVsCurrency(event.target.value);
  };

  useEffect(() => {
    const getCurrency = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllCurrencies(vsCurrency);
        if (data && data.length > 0) {
          setCurrencies([...data]);
        } else {
          setError("No data available. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching currencies:", error);
        setError("Failed to load cryptocurrencies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    getCurrency();
  }, [vsCurrency]);
  
  return (
    <div className="min-h-screen bg-crypto-dark">
      <Navbar/>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col mb-8">
          <h1 className="text-3xl font-days font-bold">Today's Top 100 Cryptocurrencies</h1>
          <div className="text-gray-400 font-medium mt-2">The global crypto market at a glance</div>
        </div>
        
        {error && (
          <div className="bg-red-500 bg-opacity-20 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-crypto-purple"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currencies.map(coin => (
              <Link to={`/coin/${coin.id}`} key={coin.id} className="bg-gray-800 rounded-xl p-4 hover:bg-gray-700 transition-colors shadow-card">
                <div className="flex items-center mb-3">
                  <img src={coin.image} alt={coin.name} className="w-8 h-8 mr-3" />
                  <div className="overflow-hidden">
                    <h3 className="font-medium truncate" title={coin.name}>
                      {coin.name.length > 15 ? coin.name.substring(0, 15) + '...' : coin.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{coin.symbol.toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold">${coin.current_price.toLocaleString()}</p>
                  <p className={`${coin.price_change_percentage_24h >= 0 ? 'text-crypto-accent' : 'text-crypto-warning'}`}>
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        <div className="mt-8 flex justify-center">
          <select
            value={vsCurrency}
            onChange={currencyChange}
            className="bg-gray-800 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-crypto-purple"
          >
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
            <option value="gbp">GBP</option>
            <option value="jpy">JPY</option>
            <option value="inr">INR</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Coins;