import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaGoogle, FaGithub } from 'react-icons/fa';

const Login = ({ onToggleForm, onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Here you would typically call your authentication API
      // For now, we'll simulate a successful login
      if (formData.email && formData.password) {
        // Mock successful login
        const userData = {
          id: '123',
          email: formData.email,
          name: formData.email.split('@')[0]
        };
        
        localStorage.setItem('cryptoXUser', JSON.stringify(userData));
        onLogin(userData);
      } else {
        setError('Please fill in all fields');
      }
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-card max-w-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">Login to CryptoX</h2>
      
      {error && (
        <div className="bg-red-500 bg-opacity-20 text-red-400 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-500" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-gray-700 text-white rounded-lg py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-crypto-purple"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-400 mb-2">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-500" />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="bg-gray-700 text-white rounded-lg py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-crypto-purple"
              placeholder="••••••••"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="bg-crypto-purple hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg w-full mb-4"
        >
          Login
        </button>
      </form>
      
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-600"></div>
        <span className="px-3 text-gray-500 text-sm">OR</span>
        <div className="flex-grow border-t border-gray-600"></div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center">
          <FaGoogle className="mr-2" /> Google
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center">
          <FaGithub className="mr-2" /> GitHub
        </button>
      </div>
      
      <p className="text-center text-gray-400">
        Don't have an account?{' '}
        <button
          onClick={onToggleForm}
          className="text-crypto-purple hover:text-purple-400"
        >
          Sign up
        </button>
      </p>
    </div>
  );
};

export default Login;