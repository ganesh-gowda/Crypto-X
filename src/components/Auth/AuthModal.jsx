import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import Login from './Login';
import Register from './Register';

const AuthModal = ({ isOpen, onClose, onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleAuth = (userData) => {
    onAuth(userData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <FaTimes size={24} />
        </button>
        
        {isLogin ? (
          <Login onToggleForm={handleToggleForm} onLogin={handleAuth} />
        ) : (
          <Register onToggleForm={handleToggleForm} onRegister={handleAuth} />
        )}
      </div>
    </div>
  );
};

export default AuthModal;