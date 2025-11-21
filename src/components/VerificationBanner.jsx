import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const VerificationBanner = () => {
  const { currentUser } = useAuth();
  const [showBanner, setShowBanner] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Show banner if user is logged in but email not verified
    if (currentUser && currentUser.emailVerified === false) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  }, [currentUser]);

  const handleResendEmail = async () => {
    setSending(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/verify/send',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('Verification email sent! Check your inbox.');
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage('');
      }, 5000);
    } catch (error) {
      setMessage(
        'Error: ' + (error.response?.data?.message || 'Failed to send verification email')
      );
    } finally {
      setSending(false);
    }
  };

  if (!showBanner) return null;

  return (
    <div className="bg-yellow-500 text-gray-900 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">
            Please verify your email address to access all features.
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {message && (
            <span className="text-sm">{message}</span>
          )}
          <button
            onClick={handleResendEmail}
            disabled={sending}
            className="px-4 py-1.5 bg-gray-900 text-yellow-500 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
          >
            {sending ? 'Sending...' : 'Resend Email'}
          </button>
          <button
            onClick={() => setShowBanner(false)}
            className="text-gray-900 hover:text-gray-700 transition"
            aria-label="Close banner"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationBanner;
