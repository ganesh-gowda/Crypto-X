import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Icons } from '../components/Icons';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Create the user account
      const user = await signup(email, password, username);
      console.log("User created successfully:", user);
      
      // Add a small delay before navigation to ensure Firestore has time to update
      setTimeout(() => {
        navigate('/portfolio');
      }, 1000);
      
    } catch (error) {
      console.error("Error in signup:", error);
      
      // Handle specific Firebase auth errors
      switch(error.code) {
        case 'auth/email-already-in-use':
          setError('Email is already in use');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/weak-password':
          setError('Password is too weak');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection');
          break;
        default:
          setError(`Failed to create an account: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-crypto-dark text-white">
      {/* Background decorations */}
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="fixed top-1/4 left-1/3 w-96 h-96 bg-crypto-purple/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/3 w-96 h-96 bg-crypto-accent/5 rounded-full blur-3xl pointer-events-none" />
      
      <Navbar />
      <div className="container mx-auto px-4 py-8 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <div className="glass-card p-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-crypto-accent/20 flex items-center justify-center">
                <Icons.Shield className="w-8 h-8" />
              </div>
            </div>
            
            <h1 className="text-3xl font-days font-bold mb-2 text-center">Create Account</h1>
            <p className="text-gray-400 text-center mb-8">Join CryptoX and start tracking your portfolio</p>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-crypto-warning/10 border border-crypto-warning/30 text-crypto-warning p-4 rounded-xl mb-6"
              >
                {error}
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 font-medium" htmlFor="username">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-crypto-purple/50 focus:ring-2 focus:ring-crypto-purple/20 transition-all"
                  placeholder="satoshi"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 font-medium" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-crypto-purple/50 focus:ring-2 focus:ring-crypto-purple/20 transition-all"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 font-medium" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-crypto-purple/50 focus:ring-2 focus:ring-crypto-purple/20 transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 font-medium" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-crypto-purple/50 focus:ring-2 focus:ring-crypto-purple/20 transition-all"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 mt-6"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <Icons.ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-crypto-purple hover:text-crypto-purple-light font-semibold transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;