import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/portfolio');
    } catch (error) {
      setError('Failed to log in. Please check your credentials.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-crypto-dark text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-gray-800 rounded-xl p-8 shadow-card">
          <h1 className="text-3xl font-days font-bold mb-6 text-center">Login</h1>
          
          {error && (
            <div className="bg-red-500 bg-opacity-20 text-red-400 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-crypto-purple"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-400 mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-crypto-purple"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-crypto-purple hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="mt-6 text-center text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-crypto-accent hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;