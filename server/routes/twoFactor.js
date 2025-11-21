import express from 'express';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import crypto from 'crypto';
import User from '../models/User.js';
import { send2FAEnabledEmail } from '../services/emailService.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Generate 2FA secret and QR code
// @route   POST /api/2fa/setup
// @access  Private
router.post('/setup', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({ message: '2FA is already enabled' });
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `CryptoX (${user.email})`,
      issuer: 'CryptoX',
      length: 32,
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    // Store secret temporarily (not enabled yet)
    user.twoFactorSecret = secret.base32;
    await user.save();

    res.json({
      secret: secret.base32,
      qrCode: qrCodeUrl,
      manualEntryKey: secret.base32,
    });
  } catch (error) {
    console.error('Error setting up 2FA:', error);
    res.status(500).json({ message: 'Failed to set up 2FA' });
  }
});

// @desc    Verify 2FA code and enable 2FA
// @route   POST /api/2fa/verify
// @access  Private
router.post('/verify', protect, async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.twoFactorSecret) {
      return res.status(400).json({ message: 'Please set up 2FA first' });
    }

    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 2, // Allow 2 time steps before and after
    });

    if (!verified) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Generate backup codes
    const backupCodes = [];
    for (let i = 0; i < 8; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      backupCodes.push({
        code,
        used: false,
      });
    }

    // Enable 2FA
    user.twoFactorEnabled = true;
    user.backupCodes = backupCodes;
    await user.save();

    // Send notification email
    try {
      await send2FAEnabledEmail(user.email, user.username);
    } catch (emailError) {
      console.error('Failed to send 2FA email:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      message: '2FA enabled successfully',
      backupCodes: backupCodes.map(bc => bc.code),
    });
  } catch (error) {
    console.error('Error verifying 2FA:', error);
    res.status(500).json({ message: 'Failed to verify 2FA' });
  }
});

// @desc    Verify 2FA login code
// @route   POST /api/2fa/verify-login
// @access  Public (but requires valid user session)
router.post('/verify-login', async (req, res) => {
  try {
    const { userId, token, isBackupCode } = req.body;

    if (!userId || !token) {
      return res.status(400).json({ message: 'User ID and token are required' });
    }

    const user = await User.findById(userId);

    if (!user || !user.twoFactorEnabled) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    let verified = false;

    if (isBackupCode) {
      // Check backup codes
      const backupCode = user.backupCodes.find(
        bc => bc.code === token.toUpperCase() && !bc.used
      );

      if (backupCode) {
        backupCode.used = true;
        await user.save();
        verified = true;
      }
    } else {
      // Verify TOTP code
      verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: token,
        window: 2,
      });
    }

    if (!verified) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    res.json({
      verified: true,
      message: '2FA verification successful',
    });
  } catch (error) {
    console.error('Error verifying 2FA login:', error);
    res.status(500).json({ message: 'Failed to verify 2FA' });
  }
});

// @desc    Disable 2FA
// @route   POST /api/2fa/disable
// @access  Private
router.post('/disable', protect, async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.twoFactorEnabled) {
      return res.status(400).json({ message: '2FA is not enabled' });
    }

    // Verify password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Disable 2FA
    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    user.backupCodes = [];
    await user.save();

    res.json({
      message: '2FA disabled successfully',
    });
  } catch (error) {
    console.error('Error disabling 2FA:', error);
    res.status(500).json({ message: 'Failed to disable 2FA' });
  }
});

// @desc    Get 2FA status
// @route   GET /api/2fa/status
// @access  Private
router.get('/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('twoFactorEnabled');
    
    res.json({
      twoFactorEnabled: user.twoFactorEnabled,
    });
  } catch (error) {
    console.error('Error checking 2FA status:', error);
    res.status(500).json({ message: 'Failed to check 2FA status' });
  }
});

// @desc    Get backup codes
// @route   GET /api/2fa/backup-codes
// @access  Private
router.get('/backup-codes', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('backupCodes twoFactorEnabled');

    if (!user.twoFactorEnabled) {
      return res.status(400).json({ message: '2FA is not enabled' });
    }

    res.json({
      backupCodes: user.backupCodes.map(bc => ({
        code: bc.code,
        used: bc.used,
      })),
    });
  } catch (error) {
    console.error('Error fetching backup codes:', error);
    res.status(500).json({ message: 'Failed to fetch backup codes' });
  }
});

// @desc    Regenerate backup codes
// @route   POST /api/2fa/regenerate-backup-codes
// @access  Private
router.post('/regenerate-backup-codes', protect, async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.twoFactorEnabled) {
      return res.status(400).json({ message: '2FA is not enabled' });
    }

    // Verify password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate new backup codes
    const backupCodes = [];
    for (let i = 0; i < 8; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      backupCodes.push({
        code,
        used: false,
      });
    }

    user.backupCodes = backupCodes;
    await user.save();

    res.json({
      message: 'Backup codes regenerated successfully',
      backupCodes: backupCodes.map(bc => bc.code),
    });
  } catch (error) {
    console.error('Error regenerating backup codes:', error);
    res.status(500).json({ message: 'Failed to regenerate backup codes' });
  }
});

export default router;
