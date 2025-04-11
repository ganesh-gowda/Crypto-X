
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { AppContext } from '../App';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { vsCurrency, setVsCurrency } = useContext(AppContext);
  const navigate = useNavigate();
  
  // Add state to control dropdown visibility
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="bg-gray-800 py-4 px-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-days font-bold text-white">
          Crypto<span className="text-crypto-purple">X</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-crypto-purple transition-colors">
            Home
          </Link>
          <Link to="/market" className="text-white hover:text-crypto-purple transition-colors">
            Market
          </Link>
          <Link to="/news" className="text-white hover:text-crypto-purple transition-colors">
            News
          </Link>
          
          {currentUser ? (
            <>
              <Link to="/portfolio" className="text-white hover:text-crypto-purple transition-colors">
                Portfolio
              </Link>
              <div className="relative">
                <button 
                  className="flex items-center text-white hover:text-crypto-purple transition-colors"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onMouseEnter={() => setDropdownOpen(true)}
                >
                  <FaUser className="mr-2" />
                  {currentUser.displayName || 'User'}
                </button>
                {dropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-xl py-2 z-10"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-white hover:bg-gray-600 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-crypto-purple transition-colors">
                Login
              </Link>
              <Link 
                to="/signup" 
                className="bg-crypto-purple hover:bg-opacity-90 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
          
          {/* Currency Selector */}
          <select 
            value={vsCurrency}
            onChange={(e) => setVsCurrency(e.target.value)}
            className="bg-gray-700 text-white rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-crypto-purple"
          >
            <option value="usd">USD</option>
            <option value="inr">INR</option>
            <option value="eur">EUR</option>
            <option value="gbp">GBP</option>
            <option value="jpy">JPY</option>
          </select>
        </div>
        
        {/* Mobile Navigation Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 mt-4 py-4 px-6">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-white hover:text-crypto-purple transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/market" 
              className="text-white hover:text-crypto-purple transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Market
            </Link>
            <Link 
              to="/news" 
              className="text-white hover:text-crypto-purple transition-colors"
              onClick={() => setIsOpen(false)}
            >
              News
            </Link>
            
            {currentUser ? (
              <>
                <Link 
                  to="/portfolio" 
                  className="text-white hover:text-crypto-purple transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Portfolio
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="text-white hover:text-crypto-purple transition-colors text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-white hover:text-crypto-purple transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-crypto-purple hover:bg-opacity-90 text-white px-4 py-2 rounded-lg transition-colors inline-block"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
            
            {/* Mobile Currency Selector - update options here too */}
            <div className="pt-2">
              <label className="block text-gray-400 mb-1">Currency</label>
              <select 
                value={vsCurrency}
                onChange={(e) => setVsCurrency(e.target.value)}
                className="bg-gray-700 text-white rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-crypto-purple"
              >
                <option value="usd">USD</option>
                <option value="inr">INR</option>
                <option value="eur">EUR</option>
                <option value="gbp">GBP</option>
                <option value="jpy">JPY</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;