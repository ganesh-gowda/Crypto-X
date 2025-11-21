import express from 'express';
import Transaction from '../models/Transaction.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get all transactions for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const { coinId, type, startDate, endDate, limit } = req.query;
    
    // Build query
    const query = { userId: req.user._id };
    
    if (coinId) query.coinId = coinId;
    if (type) query.type = type;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    // Execute query with sorting and optional limit
    let transactionsQuery = Transaction.find(query).sort({ date: -1 });
    
    if (limit) {
      transactionsQuery = transactionsQuery.limit(parseInt(limit));
    }
    
    const transactions = await transactionsQuery;
    
    res.json({
      success: true,
      count: transactions.length,
      transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions',
      error: error.message
    });
  }
});

// Get transaction statistics
router.get('/stats', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id });
    
    const stats = {
      totalTransactions: transactions.length,
      totalBuys: transactions.filter(t => t.type === 'buy').length,
      totalSells: transactions.filter(t => t.type === 'sell').length,
      totalTransfers: transactions.filter(t => t.type === 'transfer').length,
      totalInvested: transactions
        .filter(t => t.type === 'buy')
        .reduce((sum, t) => sum + t.totalValue, 0),
      totalReturns: transactions
        .filter(t => t.type === 'sell')
        .reduce((sum, t) => sum + t.totalValue, 0),
      coinBreakdown: {}
    };
    
    // Calculate per-coin statistics
    transactions.forEach(t => {
      if (!stats.coinBreakdown[t.coinId]) {
        stats.coinBreakdown[t.coinId] = {
          coinName: t.coinName,
          coinSymbol: t.coinSymbol,
          transactions: 0,
          totalAmount: 0,
          totalValue: 0
        };
      }
      stats.coinBreakdown[t.coinId].transactions++;
      stats.coinBreakdown[t.coinId].totalAmount += t.amount;
      stats.coinBreakdown[t.coinId].totalValue += t.totalValue;
    });
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

// Create a new transaction
router.post('/', protect, async (req, res) => {
  try {
    const { type, coinId, coinName, coinSymbol, amount, price, notes } = req.body;
    
    if (!type || !coinId || !coinName || !coinSymbol || !amount || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    
    const transaction = await Transaction.create({
      userId: req.user._id,
      type,
      coinId,
      coinName,
      coinSymbol,
      amount: parseFloat(amount),
      price: parseFloat(price),
      totalValue: parseFloat(amount) * parseFloat(price),
      notes: notes || ''
    });
    
    res.status(201).json({
      success: true,
      transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating transaction',
      error: error.message
    });
  }
});

// Delete a transaction
router.delete('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
    
    await transaction.deleteOne();
    
    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting transaction',
      error: error.message
    });
  }
});

export default router;
