import express from 'express';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendVerificationEmail } from '../services/emailService.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Send verification email
// @route   POST /api/verify/send
// @access  Private
router.post('/send', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = tokenExpiry;
    await user.save();

    // Send email
    await sendVerificationEmail(user.email, user.username, verificationToken);

    res.json({
      message: 'Verification email sent successfully',
      expiresAt: tokenExpiry,
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({ message: 'Failed to send verification email' });
  }
});

// @desc    Verify email with token
// @route   POST /api/verify/confirm
// @access  Public
router.post('/confirm', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    // Find user with valid token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired verification token',
      });
    }

    // Mark email as verified
    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({
      message: 'Email verified successfully',
      emailVerified: true,
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ message: 'Failed to verify email' });
  }
});

// @desc    Check verification status
// @route   GET /api/verify/status
// @access  Private
router.get('/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('emailVerified');
    
    res.json({
      emailVerified: user.emailVerified,
    });
  } catch (error) {
    console.error('Error checking verification status:', error);
    res.status(500).json({ message: 'Failed to check verification status' });
  }
});

export default router;
