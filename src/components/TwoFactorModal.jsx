import { useState } from 'react';
import axios from 'axios';

const TwoFactorModal = ({ userId, onSuccess, onCancel }) => {
  const [code, setCode] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // First verify the 2FA code
      const verifyResponse = await axios.post('http://localhost:5000/api/2fa/verify-login', {
        userId,
        token: code,
        isBackupCode: useBackupCode,
      });

      if (verifyResponse.data.verified) {
        // Then complete the login
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login-2fa', {
          userId,
          token: code,
          isBackupCode: useBackupCode,
        });

        onSuccess(loginResponse.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-4">Two-Factor Authentication</h2>
        
        <p className="text-gray-400 mb-6">
          {useBackupCode
            ? 'Enter one of your backup codes:'
            : 'Enter the 6-digit code from your authenticator app:'}
        </p>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify}>
          <input
            type="text"
            value={code}
            onChange={(e) => {
              const value = useBackupCode ? e.target.value.toUpperCase() : e.target.value.replace(/\D/g, '');
              setCode(value);
            }}
            placeholder={useBackupCode ? 'XXXXXXXX' : '000000'}
            maxLength={useBackupCode ? 8 : 6}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 mb-4 text-center text-2xl tracking-widest text-white"
            autoFocus
            required
          />

          <button
            type="button"
            onClick={() => {
              setUseBackupCode(!useBackupCode);
              setCode('');
              setError('');
            }}
            className="text-purple-400 hover:text-purple-300 text-sm mb-6 block"
          >
            {useBackupCode ? 'Use authenticator app instead' : 'Use backup code instead'}
          </button>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || code.length < (useBackupCode ? 8 : 6)}
              className="flex-1 px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition font-medium text-white"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded-lg transition text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TwoFactorModal;
