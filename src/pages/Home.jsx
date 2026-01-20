import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { AppContext } from "../App";
import { useCryptoData } from '../hooks/useCryptoData';
import { Icons } from '../components/Icons';

const Home = () => {
  const { vsCurrency } = useContext(AppContext);
  const { data: trendingCoins, loading: trendingLoading } = useCryptoData('/coins/markets', {
    per_page: 10,
    page: 1,
    sparkline: false,
    price_change_percentage: '24h'
  });

  // Currency symbol mapping
  const currencySymbols = {
    usd: '$',
    eur: '€',
    gbp: '£',
    jpy: '¥',
    inr: '₹'
  };

  const currencySymbol = currencySymbols[vsCurrency] || '$';

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const features = [
    {
      icon: Icons.Chart,
      title: 'Real-Time Tracking',
      description: 'Monitor cryptocurrency prices and market movements in real-time with accurate data.',
      gradient: 'from-crypto-purple to-crypto-blue'
    },
    {
      icon: Icons.Wallet,
      title: 'Portfolio Management',
      description: 'Track your crypto holdings, analyze performance, and manage your investments.',
      gradient: 'from-crypto-accent to-crypto-cyan'
    },
    {
      icon: Icons.Zap,
      title: 'Instant Alerts',
      description: 'Set custom price alerts and get notified when cryptocurrencies hit your target prices.',
      gradient: 'from-crypto-gold to-yellow-300'
    }
  ];

  return (
    <div className="min-h-screen bg-crypto-dark text-white overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-crypto-purple/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-crypto-accent/10 rounded-full blur-3xl pointer-events-none" />
      
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 relative">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 pt-8"
        >
          {/* Floating crypto icons */}
          <div className="absolute left-10 top-20 float opacity-50">
            <Icons.Bitcoin className="w-16 h-16" />
          </div>
          <div className="absolute right-10 top-40 float opacity-50" style={{ animationDelay: '2s' }}>
            <Icons.Ethereum className="w-14 h-14" />
          </div>
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-crypto-purple/10 border border-crypto-purple/30 mb-6"
          >
            <Icons.Rocket className="w-5 h-5" />
            <span className="text-sm font-medium text-crypto-purple-light">The Future of Crypto Tracking</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-days font-bold mb-6 leading-tight">
            Track and Manage Your
            <br />
            <span className="gradient-text">Crypto Portfolio</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Real-time cryptocurrency prices, portfolio tracking, and market insights 
            all in one powerful platform.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/market" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
                <Icons.Chart className="w-5 h-5" />
                <span>Explore Market</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/signup" className="btn-secondary inline-flex items-center gap-2 text-lg px-8 py-4">
                <Icons.User className="w-5 h-5" />
                <span>Create Account</span>
              </Link>
            </motion.div>
          </div>
          
          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-8 mt-16"
          >
            {[
              { value: '10K+', label: 'Cryptocurrencies' },
              { value: '100+', label: 'Exchanges' },
              { value: '24/7', label: 'Real-time Data' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold gradient-text-purple">{stat.value}</div>
                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Trending Coins Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-20"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-crypto-accent/20 flex items-center justify-center">
                <Icons.TrendingUp className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-days font-bold">Trending Cryptocurrencies</h2>
            </div>
            <Link 
              to="/market" 
              className="flex items-center gap-2 text-crypto-purple hover:text-crypto-purple-light transition-colors"
            >
              <span>View All</span>
              <Icons.ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {trendingLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="glass-card overflow-hidden">
              <table className="crypto-table">
                <thead>
                  <tr>
                    <th>Coin</th>
                    <th className="text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {trendingCoins && trendingCoins.map((coin, index) => (
                    <motion.tr 
                      key={coin.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group"
                    >
                      <td>
                        <Link to={`/coin/${coin.id}`} className="flex items-center gap-3">
                          <div className="relative">
                            <img 
                              src={coin.image} 
                              alt={coin.name} 
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div>
                            <div className="font-semibold group-hover:text-crypto-purple transition-colors">
                              {coin.name}
                            </div>
                            <div className="text-gray-500 text-sm">{coin.symbol.toUpperCase()}</div>
                          </div>
                        </Link>
                      </td>
                      <td className="text-right font-medium">
                        {currencySymbol}{coin.current_price?.toLocaleString() || '0.00'}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Features Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-days font-bold mb-4">Why Choose CryptoX?</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Powerful features to help you track, manage, and grow your cryptocurrency portfolio.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="glass-card-hover p-8 text-center"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} p-0.5 mb-6 mx-auto`}>
                    <div className="w-full h-full rounded-2xl bg-crypto-dark flex items-center justify-center">
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-16"
        >
          <div className="glass-card p-12 relative overflow-hidden">
            {/* Gradient decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-crypto-purple/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-crypto-accent/20 rounded-full blur-3xl" />
            
            <div className="relative">
              <Icons.Shield className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-3xl font-days font-bold mb-4">
                Ready to Start Your Crypto Journey?
              </h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Join thousands of traders and investors who trust CryptoX for their portfolio management needs.
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link to="/signup" className="btn-accent inline-flex items-center gap-2 text-lg px-8 py-4">
                  <span>Get Started Free</span>
                  <Icons.ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;