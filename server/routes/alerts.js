import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/alerts
// @desc    Get user alerts
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('alerts');
    res.json(user.alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/alerts
// @desc    Add price alert
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { coinId, targetPrice, condition } = req.body;

    const user = await User.findById(req.user._id);

    user.alerts.push({
      coinId,
      targetPrice: parseFloat(targetPrice),
      condition,
      triggered: false,
    });

    await user.save();

    res.status(201).json(user.alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/alerts/:id
// @desc    Update alert
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { triggered } = req.body;

    const user = await User.findById(req.user._id);
    const alert = user.alerts.id(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    if (triggered !== undefined) {
      alert.triggered = triggered;
    }

    await user.save();

    res.json(user.alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/alerts/:id
// @desc    Delete alert
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.alerts = user.alerts.filter(
      (alert) => alert._id.toString() !== req.params.id
    );

    await user.save();

    res.json(user.alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
