import express from 'express';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { protect } from '../middleware/auth.js';
import axios from 'axios';

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

// @route   GET /api/portfolio/analytics
// @desc    Get portfolio analytics (P&L, ROI, performance metrics)
// @access  Private
router.get('/analytics', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('portfolio');
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ date: -1 });
    
    if (!user.portfolio || user.portfolio.length === 0) {
      return res.json({
        success: true,
        analytics: {
          totalInvested: 0,
          currentValue: 0,
          totalProfitLoss: 0,
          totalProfitLossPercentage: 0,
          roi: 0,
          bestPerformer: null,
          worstPerformer: null,
          assetAllocation: [],
          performanceHistory: [],
          dailyPL: 0,
          weeklyPL: 0,
          monthlyPL: 0
        }
      });
    }

    // Fetch current prices for all coins in portfolio
    const coinIds = user.portfolio.map(item => item.coinId).join(',');
    const priceResponse = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd&include_24h_change=true&include_7d_change=true&include_30d_change=true`
    );
    const currentPrices = priceResponse.data;

    // Calculate metrics for each holding
    let totalInvested = 0;
    let currentValue = 0;
    const holdings = [];

    for (const item of user.portfolio) {
      const invested = item.amount * item.purchasePrice;
      const current = currentPrices[item.coinId]?.usd ? item.amount * currentPrices[item.coinId].usd : 0;
      const profitLoss = current - invested;
      const profitLossPercentage = invested > 0 ? ((profitLoss / invested) * 100) : 0;

      totalInvested += invested;
      currentValue += current;

      holdings.push({
        coinId: item.coinId,
        amount: item.amount,
        invested,
        currentValue: current,
        profitLoss,
        profitLossPercentage,
        currentPrice: currentPrices[item.coinId]?.usd || 0,
        change24h: currentPrices[item.coinId]?.usd_24h_change || 0,
        change7d: currentPrices[item.coinId]?.usd_7d_change || 0,
        change30d: currentPrices[item.coinId]?.usd_30d_change || 0
      });
    }

    // Calculate overall metrics
    const totalProfitLoss = currentValue - totalInvested;
    const totalProfitLossPercentage = totalInvested > 0 ? ((totalProfitLoss / totalInvested) * 100) : 0;
    const roi = totalProfitLossPercentage;

    // Find best and worst performers
    const sortedByPerformance = [...holdings].sort((a, b) => b.profitLossPercentage - a.profitLossPercentage);
    const bestPerformer = sortedByPerformance[0] || null;
    const worstPerformer = sortedByPerformance[sortedByPerformance.length - 1] || null;

    // Asset allocation
    const assetAllocation = holdings.map(h => ({
      coinId: h.coinId,
      value: h.currentValue,
      percentage: currentValue > 0 ? ((h.currentValue / currentValue) * 100) : 0
    }));

    // Calculate P&L for different periods
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const dailyPL = holdings.reduce((sum, h) => sum + (h.currentValue * (h.change24h / 100)), 0);
    const weeklyPL = holdings.reduce((sum, h) => sum + (h.currentValue * (h.change7d / 100)), 0);
    const monthlyPL = holdings.reduce((sum, h) => sum + (h.currentValue * (h.change30d / 100)), 0);

    // Win rate calculation
    const profitableHoldings = holdings.filter(h => h.profitLoss > 0).length;
    const winRate = holdings.length > 0 ? ((profitableHoldings / holdings.length) * 100) : 0;

    // Transaction-based performance history (last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentTransactions = transactions.filter(t => new Date(t.date) >= thirtyDaysAgo);
    
    // Group transactions by date for performance history
    const performanceHistory = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      performanceHistory.push({
        date: dateStr,
        value: currentValue, // Simplified - in real app would calculate historical value
        profitLoss: totalProfitLoss
      });
    }

    res.json({
      success: true,
      analytics: {
        totalInvested,
        currentValue,
        totalProfitLoss,
        totalProfitLossPercentage,
        roi,
        winRate,
        bestPerformer,
        worstPerformer,
        assetAllocation,
        holdings,
        performanceHistory,
        dailyPL,
        weeklyPL,
        monthlyPL,
        totalTransactions: transactions.length,
        profitableHoldings
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error generating analytics',
      error: error.message 
    });
  }
});

export default router;
