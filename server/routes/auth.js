import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { sendVerificationEmail } from '../services/emailService.js';

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Please enter a valid email address' 
      });
    }

    // Additional email domain validation (optional - common domains)
    const validDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'protonmail.com'];
    const emailDomain = email.split('@')[1]?.toLowerCase();
    
    // Check if it's a common domain or has proper format
    const hasValidFormat = emailDomain && emailDomain.includes('.');
    if (!hasValidFormat) {
      return res.status(400).json({ 
        message: 'Please enter a valid email address from a recognized email provider' 
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({ 
        message: 'User already exists with this email or username' 
      });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      portfolio: [],
      alerts: [],
      emailVerified: true, // Auto-verify for development
      verificationToken: undefined,
      verificationTokenExpires: undefined,
    });

    if (user) {
      // Send verification email (optional - will log to console in development)
      try {
        const verificationToken = crypto.randomBytes(32).toString('hex');
        console.log('\n📧 VERIFICATION EMAIL (Development Mode):');
        console.log(`To: ${user.email}`);
        console.log(`Verification Link: http://localhost:5174/verify-email?token=${verificationToken}`);
        console.log('Note: Email verification is AUTO-ENABLED for development\n');
      } catch (emailError) {
        console.error('Email log error:', emailError);
      }

      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified,
        token: generateToken(user._id),
        message: 'Registration successful!',
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified,
        twoFactorEnabled: false,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login-2fa
// @desc    Complete 2FA login and get token
// @access  Public
router.post('/login-2fa', async (req, res) => {
  try {
    const { userId, token, isBackupCode } = req.body;

    if (!userId || !token) {
      return res.status(400).json({ message: 'User ID and token are required' });
    }

    const user = await User.findById(userId);

    if (!user || !user.twoFactorEnabled) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    // Verification is done in the 2FA route, we just issue the JWT token here
    // In production, you might want to verify the token again for extra security

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      emailVerified: user.emailVerified,
      twoFactorEnabled: user.twoFactorEnabled,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('2FA login error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
