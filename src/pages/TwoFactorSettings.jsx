import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const TwoFactorSettings = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [setupStep, setSetupStep] = useState('initial'); // initial, qr, verify, success
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    checkTwoFactorStatus();
  }, []);

  const checkTwoFactorStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/2fa/status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTwoFactorEnabled(response.data.twoFactorEnabled);
      
      if (response.data.twoFactorEnabled) {
        loadBackupCodes();
      }
    } catch (error) {
      console.error('Error checking 2FA status:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBackupCodes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/2fa/backup-codes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBackupCodes(response.data.backupCodes);
    } catch (error) {
      console.error('Error loading backup codes:', error);
    }
  };

  const handleSetupStart = async () => {
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/2fa/setup',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQrCode(response.data.qrCode);
      setSecret(response.data.secret);
      setSetupStep('qr');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to start 2FA setup');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/2fa/verify',
        { token: verificationCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBackupCodes(response.data.backupCodes.map(code => ({ code, used: false })));
      setSetupStep('success');
      setTwoFactorEnabled(true);
      setSuccess('2FA enabled successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/2fa/disable',
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTwoFactorEnabled(false);
      setPassword('');
      setSuccess('2FA disabled successfully');
      setSetupStep('initial');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to disable 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateBackupCodes = async () => {
    const confirmRegenerate = window.confirm(
      'This will invalidate all existing backup codes. Continue?'
    );
    if (!confirmRegenerate) return;

    const password = prompt('Enter your password to confirm:');
    if (!password) return;

    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/2fa/regenerate-backup-codes',
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBackupCodes(response.data.backupCodes.map(code => ({ code, used: false })));
      setSuccess('Backup codes regenerated successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to regenerate backup codes');
    } finally {
      setLoading(false);
    }
  };

  const downloadBackupCodes = () => {
    const text = backupCodes.map(bc => bc.code).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cryptox-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading && setupStep === 'initial') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading 2FA settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Two-Factor Authentication (2FA)</h1>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-500 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {!twoFactorEnabled && setupStep === 'initial' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Enable Two-Factor Authentication</h2>
            <p className="text-gray-400 mb-6">
              Add an extra layer of security to your account by requiring a verification code from your
              authenticator app in addition to your password.
            </p>

            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2">What you'll need:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>A smartphone or tablet</li>
                <li>An authenticator app (Google Authenticator, Authy, Microsoft Authenticator, etc.)</li>
              </ul>
            </div>

            <button
              onClick={handleSetupStart}
              disabled={loading}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 rounded-lg transition font-medium"
            >
              {loading ? 'Setting up...' : 'Enable 2FA'}
            </button>
          </div>
        )}

        {setupStep === 'qr' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Scan QR Code</h2>
            <p className="text-gray-400 mb-6">
              Scan this QR code with your authenticator app, or enter the secret key manually.
            </p>

            <div className="bg-white p-6 rounded-lg inline-block mb-6">
              <img src={qrCode} alt="QR Code" className="w-64 h-64" />
            </div>

            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-400 mb-2">Manual entry key:</p>
              <code className="text-purple-400 font-mono break-all">{secret}</code>
            </div>

            <form onSubmit={handleVerify}>
              <label className="block mb-4">
                <span className="text-gray-300 mb-2 block">Enter verification code:</span>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-center text-2xl tracking-widest"
                  required
                />
              </label>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading || verificationCode.length !== 6}
                  className="flex-1 px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 rounded-lg transition font-medium"
                >
                  {loading ? 'Verifying...' : 'Verify & Enable'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSetupStep('initial');
                    setVerificationCode('');
                    setError('');
                  }}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {setupStep === 'success' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">2FA Enabled Successfully!</h2>
              <p className="text-gray-400">Save these backup codes in a secure location.</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-4 text-center">Backup Codes</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {backupCodes.map((bc, index) => (
                  <code key={index} className="bg-gray-800 px-4 py-2 rounded text-center font-mono text-purple-400">
                    {bc.code}
                  </code>
                ))}
              </div>
              <button
                onClick={downloadBackupCodes}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition"
              >
                Download Backup Codes
              </button>
            </div>

            <button
              onClick={() => setSetupStep('initial')}
              className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg transition font-medium"
            >
              Done
            </button>
          </div>
        )}

        {twoFactorEnabled && setupStep === 'initial' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">2FA Status</h2>
                <span className="px-3 py-1 bg-green-500 bg-opacity-20 border border-green-500 text-green-500 rounded-full text-sm">
                  Enabled
                </span>
              </div>
              <p className="text-gray-400 mb-6">
                Your account is protected with two-factor authentication.
              </p>

              <form onSubmit={handleDisable} className="space-y-4">
                <div>
                  <label className="block mb-2 text-gray-300">
                    Enter password to disable 2FA:
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-50 rounded-lg transition font-medium"
                >
                  {loading ? 'Disabling...' : 'Disable 2FA'}
                </button>
              </form>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Backup Codes</h3>
              <p className="text-gray-400 mb-4">
                Use these codes if you lose access to your authenticator app. Each code can only be used once.
              </p>

              <div className="bg-gray-700 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-3">
                  {backupCodes.map((bc, index) => (
                    <div
                      key={index}
                      className={`px-4 py-2 rounded text-center font-mono ${
                        bc.used
                          ? 'bg-gray-600 text-gray-500 line-through'
                          : 'bg-gray-800 text-purple-400'
                      }`}
                    >
                      {bc.code}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={downloadBackupCodes}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                >
                  Download Codes
                </button>
                <button
                  onClick={handleRegenerateBackupCodes}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 rounded-lg transition"
                >
                  {loading ? 'Regenerating...' : 'Regenerate Codes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoFactorSettings;
