import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const Register = ({ onToggleForm, onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      // Here you would typically call your registration API
      // For now, we'll simulate a successful registration
      if (formData.name && formData.email && formData.password) {
        // Mock successful registration
        const userData = {
          id: '123',
          name: formData.name,
          email: formData.email
        };
        
        localStorage.setItem('cryptoXUser', JSON.stringify(userData));
        onRegister(userData);
      } else {
        setError('Please fill in all fields');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-card max-w-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
      
      {error && (
        <div className="bg-red-500 bg-opacity-20 text-red-400 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-500" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-gray-700 text-white rounded-lg py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-crypto-purple"
              placeholder="Your Name"
              required
            />
          </div>
        </div>
        
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
        
        <div className="mb-4">
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
        
        <div className="mb-6">
          <label className="block text-gray-400 mb-2">Confirm Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-500" />
            </div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
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
          Create Account
        </button>
      </form>
      
      <p className="text-center text-gray-400">
        Already have an account?{' '}
        <button
          onClick={onToggleForm}
          className="text-crypto-purple hover:text-purple-400"
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default Register;