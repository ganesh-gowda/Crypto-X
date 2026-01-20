import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { AppContext } from '../App';
import { Icons } from './Icons';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { vsCurrency, setVsCurrency } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Home', icon: Icons.Home },
    { to: '/market', label: 'Market', icon: Icons.Chart },
    { to: '/news', label: 'News', icon: Icons.News },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-card border-0 border-b border-white/10 rounded-none">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-xl bg-purple-gradient flex items-center justify-center shadow-glow"
            >
              <span className="text-white font-bold text-xl">C</span>
            </motion.div>
            <span className="text-2xl font-days font-bold text-white">
              Crypto<span className="gradient-text-purple">X</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive(link.to)
                      ? 'bg-crypto-purple/20 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                  {isActive(link.to) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-crypto-purple/20 rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
            
            {currentUser ? (
              <>
                <Link
                  to="/portfolio"
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive('/portfolio')
                      ? 'bg-crypto-purple/20 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icons.Wallet className="w-5 h-5" />
                  <span className="font-medium">Portfolio</span>
                </Link>
                
                {/* User Dropdown */}
                <div className="relative ml-2">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:border-crypto-purple/30 transition-all duration-300"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-gradient flex items-center justify-center">
                      <Icons.User className="w-4 h-4" />
                    </div>
                    <span className="font-medium max-w-[100px] truncate">
                      {currentUser.displayName || 'User'}
                    </span>
                  </motion.button>
                  
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 glass-card py-2 z-50"
                        onMouseLeave={() => setDropdownOpen(false)}
                      >
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                        >
                          <Icons.Logout className="w-5 h-5" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <Link 
                  to="/login" 
                  className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Icons.Login className="w-5 h-5" />
                  <span className="font-medium">Login</span>
                </Link>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link to="/signup" className="btn-primary flex items-center gap-2">
                    <span>Sign Up</span>
                    <Icons.ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
            )}
            
            {/* Currency Selector */}
            <div className="ml-4 pl-4 border-l border-white/10">
              <select 
                value={vsCurrency}
                onChange={(e) => setVsCurrency(e.target.value)}
                className="bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-crypto-purple/50 transition-all duration-300 cursor-pointer"
              >
                <option value="usd" className="bg-crypto-dark">USD</option>
                <option value="inr" className="bg-crypto-dark">INR</option>
                <option value="eur" className="bg-crypto-dark">EUR</option>
                <option value="gbp" className="bg-crypto-dark">GBP</option>
                <option value="jpy" className="bg-crypto-dark">JPY</option>
              </select>
            </div>
          </div>
          
          {/* Mobile Navigation Toggle */}
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <Icons.Close className="w-6 h-6" /> : <Icons.Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-white/10 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-2">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link 
                    key={link.to}
                    to={link.to} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive(link.to)
                        ? 'bg-crypto-purple/20 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}
              
              {currentUser ? (
                <>
                  <Link 
                    to="/portfolio" 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive('/portfolio')
                        ? 'bg-crypto-purple/20 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icons.Wallet className="w-5 h-5" />
                    <span className="font-medium">Portfolio</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
                  >
                    <Icons.Logout className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icons.Login className="w-5 h-5" />
                    <span className="font-medium">Login</span>
                  </Link>
                  <Link 
                    to="/signup" 
                    className="btn-primary flex items-center justify-center gap-2 mt-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <span>Sign Up</span>
                    <Icons.ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              )}
              
              {/* Mobile Currency Selector */}
              <div className="pt-4 mt-2 border-t border-white/10">
                <label className="block text-gray-500 text-sm mb-2">Currency</label>
                <select 
                  value={vsCurrency}
                  onChange={(e) => setVsCurrency(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-crypto-purple/50"
                >
                  <option value="usd" className="bg-crypto-dark">USD</option>
                  <option value="inr" className="bg-crypto-dark">INR</option>
                  <option value="eur" className="bg-crypto-dark">EUR</option>
                  <option value="gbp" className="bg-crypto-dark">GBP</option>
                  <option value="jpy" className="bg-crypto-dark">JPY</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;