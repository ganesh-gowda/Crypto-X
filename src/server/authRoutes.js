import express from 'express';
import { connectToDatabase } from '../database/mongo.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    const { db } = await connectToDatabase();
    
    // Check if user exists by email
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Check if username is taken (using displayName as username)
    const existingUsername = await db.collection('users').findOne({ username: displayName });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user - include both username and displayName
    const newUser = {
      email,
      username: displayName, // Store as username for the index
      displayName,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    const result = await db.collection('users').insertOne(newUser);
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: result.insertedId.toString(), email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    // Omit password from response
    const { password: _pw, ...safeUser } = { ...newUser, _id: result.insertedId };
    res.status(201).json({ ...safeUser, token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { db } = await connectToDatabase();
    
    // Find user
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id.toString(), email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    // Omit password from response
    const { password: _pw, ...safeUser } = user;
    res.json({ ...safeUser, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user endpoint
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { db } = await connectToDatabase();
    const _id = (() => { try { return new ObjectId(userId); } catch { return null; }})();
    if (!_id) {
      return res.status(400).json({ message: 'Invalid user id' });
    }
    const user = await db.collection('users').findOne({ _id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Don't return password hash
    const { password, ...userData } = user;
    res.json(userData);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;