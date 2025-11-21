import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/portfolio
// @desc    Get user portfolio
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('portfolio');
    res.json(user.portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/portfolio
// @desc    Add coin to portfolio
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { coinId, amount, purchasePrice, purchaseDate } = req.body;

    const user = await User.findById(req.user._id);

    user.portfolio.push({
      coinId,
      amount: parseFloat(amount),
      purchasePrice: parseFloat(purchasePrice),
      purchaseDate,
    });

    await user.save();

    res.status(201).json(user.portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/portfolio/:id
// @desc    Update portfolio item
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { coinId, amount, purchasePrice, purchaseDate } = req.body;

    const user = await User.findById(req.user._id);
    const portfolioItem = user.portfolio.id(req.params.id);

    if (!portfolioItem) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    portfolioItem.coinId = coinId || portfolioItem.coinId;
    portfolioItem.amount = amount !== undefined ? parseFloat(amount) : portfolioItem.amount;
    portfolioItem.purchasePrice = purchasePrice !== undefined ? parseFloat(purchasePrice) : portfolioItem.purchasePrice;
    portfolioItem.purchaseDate = purchaseDate || portfolioItem.purchaseDate;

    await user.save();

    res.json(user.portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/portfolio/:id
// @desc    Delete portfolio item
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.portfolio = user.portfolio.filter(
      (item) => item._id.toString() !== req.params.id
    );

    await user.save();

    res.json(user.portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
