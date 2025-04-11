import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

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
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-gray-800 rounded-xl p-8 shadow-card">
          <h1 className="text-3xl font-days font-bold mb-6 text-center">Sign Up</h1>
          
          {error && (
            <div className="bg-red-500 bg-opacity-20 text-red-400 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-crypto-purple"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
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
            
            <div className="mb-4">
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
            
            <div className="mb-6">
              <label className="block text-gray-400 mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-crypto-purple"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-crypto-purple hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          
          <div className="mt-6 text-center text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-crypto-accent hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;