import express from 'express';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { protect } from '../middleware/auth.js';
import axios from 'axios';

const router = express.Router();

// @route   GET /api/reports/portfolio-data
// @desc    Get complete portfolio data for PDF/CSV export
// @access  Private
router.get('/portfolio-data', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('portfolio username email');
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ date: -1 });
    
    if (!user.portfolio || user.portfolio.length === 0) {
      return res.json({
        success: true,
        data: {
          user: {
            username: user.username,
            email: user.email
          },
          portfolio: [],
          transactions: [],
          summary: {
            totalInvested: 0,
            currentValue: 0,
            totalProfitLoss: 0,
            totalProfitLossPercentage: 0
          }
        }
      });
    }

    // Fetch current prices
    const coinIds = user.portfolio.map(item => item.coinId).join(',');
    const priceResponse = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`
    );
    const currentPrices = priceResponse.data;

    // Calculate portfolio data
    let totalInvested = 0;
    let currentValue = 0;
    const portfolioData = [];

    for (const item of user.portfolio) {
      const invested = item.amount * item.purchasePrice;
      const current = currentPrices[item.coinId]?.usd ? item.amount * currentPrices[item.coinId].usd : 0;
      const profitLoss = current - invested;
      const profitLossPercentage = invested > 0 ? ((profitLoss / invested) * 100) : 0;

      totalInvested += invested;
      currentValue += current;

      portfolioData.push({
        coinId: item.coinId,
        amount: item.amount,
        purchasePrice: item.purchasePrice,
        purchaseDate: item.purchaseDate,
        currentPrice: currentPrices[item.coinId]?.usd || 0,
        invested,
        currentValue: current,
        profitLoss,
        profitLossPercentage
      });
    }

    const totalProfitLoss = currentValue - totalInvested;
    const totalProfitLossPercentage = totalInvested > 0 ? ((totalProfitLoss / totalInvested) * 100) : 0;

    res.json({
      success: true,
      data: {
        user: {
          username: user.username,
          email: user.email
        },
        portfolio: portfolioData,
        transactions: transactions.map(t => ({
          type: t.type,
          coinId: t.coinId,
          coinName: t.coinName,
          coinSymbol: t.coinSymbol,
          amount: t.amount,
          price: t.price,
          totalValue: t.totalValue,
          date: t.date,
          notes: t.notes
        })),
        summary: {
          totalInvested,
          currentValue,
          totalProfitLoss,
          totalProfitLossPercentage,
          generatedAt: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    console.error('Portfolio data error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching portfolio data',
      error: error.message
    });
  }
});

// @route   GET /api/reports/tax-report
// @desc    Generate tax report with capital gains/losses
// @access  Private
router.get('/tax-report', protect, async (req, res) => {
  try {
    const { year } = req.query;
    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    
    const startDate = new Date(targetYear, 0, 1);
    const endDate = new Date(targetYear, 11, 31, 23, 59, 59);

    const transactions = await Transaction.find({
      userId: req.user._id,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: 1 });

    // Calculate capital gains/losses
    const holdings = {};
    const taxEvents = [];
    let totalShortTermGains = 0;
    let totalLongTermGains = 0;

    transactions.forEach(tx => {
      if (tx.type === 'buy') {
        // Add to holdings with FIFO tracking
        if (!holdings[tx.coinId]) {
          holdings[tx.coinId] = [];
        }
        holdings[tx.coinId].push({
          amount: tx.amount,
          costBasis: tx.price,
          date: tx.date
        });
      } else if (tx.type === 'sell') {
        // Calculate gains using FIFO
        if (holdings[tx.coinId] && holdings[tx.coinId].length > 0) {
          let remainingToSell = tx.amount;
          
          while (remainingToSell > 0 && holdings[tx.coinId].length > 0) {
            const lot = holdings[tx.coinId][0];
            const sellAmount = Math.min(remainingToSell, lot.amount);
            
            const costBasis = sellAmount * lot.costBasis;
            const proceeds = sellAmount * tx.price;
            const gain = proceeds - costBasis;
            
            // Determine if short-term (< 1 year) or long-term
            const holdingPeriod = (new Date(tx.date) - new Date(lot.date)) / (1000 * 60 * 60 * 24);
            const isLongTerm = holdingPeriod >= 365;
            
            if (isLongTerm) {
              totalLongTermGains += gain;
            } else {
              totalShortTermGains += gain;
            }

            taxEvents.push({
              date: tx.date,
              coinId: tx.coinId,
              coinName: tx.coinName,
              type: isLongTerm ? 'Long-term' : 'Short-term',
              amount: sellAmount,
              costBasis: lot.costBasis,
              salePrice: tx.price,
              proceeds,
              capitalGain: gain,
              holdingPeriod: Math.floor(holdingPeriod)
            });

            lot.amount -= sellAmount;
            if (lot.amount <= 0.00000001) {
              holdings[tx.coinId].shift();
            }
            remainingToSell -= sellAmount;
          }
        }
      }
    });

    const user = await User.findById(req.user._id).select('username email');

    res.json({
      success: true,
      taxReport: {
        year: targetYear,
        user: {
          username: user.username,
          email: user.email
        },
        summary: {
          totalShortTermGains,
          totalLongTermGains,
          totalCapitalGains: totalShortTermGains + totalLongTermGains,
          totalTransactions: transactions.length,
          taxableEvents: taxEvents.length
        },
        taxEvents,
        disclaimer: 'This report is for informational purposes only. Please consult with a tax professional for accurate tax filing.'
      }
    });
  } catch (error) {
    console.error('Tax report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating tax report',
      error: error.message
    });
  }
});

// @route   GET /api/reports/transactions-csv
// @desc    Get transactions data for CSV export
// @access  Private
router.get('/transactions-csv', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ date: -1 });
    
    res.json({
      success: true,
      transactions: transactions.map(t => ({
        Date: new Date(t.date).toLocaleDateString(),
        Time: new Date(t.date).toLocaleTimeString(),
        Type: t.type,
        'Coin Name': t.coinName,
        Symbol: t.coinSymbol,
        Amount: t.amount,
        'Price (USD)': t.price,
        'Total Value (USD)': t.totalValue,
        Notes: t.notes || ''
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions',
      error: error.message
    });
  }
});

// @route   GET /api/reports/alerts-csv
// @desc    Get alerts data for CSV export
// @access  Private
router.get('/alerts-csv', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('alerts');
    
    const alertsData = user.alerts.map(alert => ({
      'Coin ID': alert.coinId,
      'Target Price (USD)': alert.targetPrice,
      Condition: alert.condition,
      Status: alert.triggered ? 'Triggered' : 'Active',
      'Created At': new Date(alert.createdAt).toLocaleDateString(),
      'Triggered At': alert.triggeredAt ? new Date(alert.triggeredAt).toLocaleDateString() : 'N/A'
    }));

    res.json({
      success: true,
      alerts: alertsData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching alerts',
      error: error.message
    });
  }
});

export default router;
