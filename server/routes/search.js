import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import axios from 'axios';

const router = express.Router();

// @route   GET /api/search/global
// @desc    Global search across coins with advanced filters
// @access  Public
router.get('/global', async (req, res) => {
  try {
    const { 
      query, 
      minPrice, 
      maxPrice, 
      minMarketCap, 
      maxMarketCap,
      minVolume,
      maxVolume,
      minChange,
      maxChange,
      sortBy,
      order
    } = req.query;

    // Fetch coins from CoinGecko
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: 'usd',
          order: order === 'desc' ? 'market_cap_desc' : 'market_cap_asc',
          per_page: 250,
          page: 1,
          sparkline: false
        }
      }
    );

    let coins = response.data;

    // Apply search query filter
    if (query) {
      const searchLower = query.toLowerCase();
      coins = coins.filter(coin => 
        coin.name.toLowerCase().includes(searchLower) ||
        coin.symbol.toLowerCase().includes(searchLower) ||
        coin.id.toLowerCase().includes(searchLower)
      );
    }

    // Apply price filters
    if (minPrice) {
      coins = coins.filter(coin => coin.current_price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      coins = coins.filter(coin => coin.current_price <= parseFloat(maxPrice));
    }

    // Apply market cap filters
    if (minMarketCap) {
      coins = coins.filter(coin => coin.market_cap >= parseFloat(minMarketCap));
    }
    if (maxMarketCap) {
      coins = coins.filter(coin => coin.market_cap <= parseFloat(maxMarketCap));
    }

    // Apply volume filters
    if (minVolume) {
      coins = coins.filter(coin => coin.total_volume >= parseFloat(minVolume));
    }
    if (maxVolume) {
      coins = coins.filter(coin => coin.total_volume <= parseFloat(maxVolume));
    }

    // Apply price change filters
    if (minChange) {
      coins = coins.filter(coin => coin.price_change_percentage_24h >= parseFloat(minChange));
    }
    if (maxChange) {
      coins = coins.filter(coin => coin.price_change_percentage_24h <= parseFloat(maxChange));
    }

    // Sort results
    if (sortBy) {
      coins.sort((a, b) => {
        const aVal = a[sortBy] || 0;
        const bVal = b[sortBy] || 0;
        return order === 'desc' ? bVal - aVal : aVal - bVal;
      });
    }

    res.json({
      success: true,
      count: coins.length,
      coins: coins.slice(0, 100) // Limit to 100 results
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error performing search',
      error: error.message
    });
  }
});

// @route   GET /api/search/trending
// @desc    Get trending searches (most popular coins)
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/search/trending');
    
    res.json({
      success: true,
      trending: response.data.coins
    });
  } catch (error) {
    console.error('Trending error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trending searches',
      error: error.message
    });
  }
});

// @route   GET /api/search/watchlist
// @desc    Get user's saved watchlist
// @access  Private
router.get('/watchlist', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('watchlist');
    
    res.json({
      success: true,
      watchlist: user.watchlist || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching watchlist',
      error: error.message
    });
  }
});

// @route   POST /api/search/watchlist
// @desc    Add coin to watchlist
// @access  Private
router.post('/watchlist', protect, async (req, res) => {
  try {
    const { coinId, coinName, coinSymbol } = req.body;

    if (!coinId) {
      return res.status(400).json({
        success: false,
        message: 'Coin ID is required'
      });
    }

    const user = await User.findById(req.user._id);
    
    // Check if already in watchlist
    const exists = user.watchlist.some(item => item.coinId === coinId);
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Coin already in watchlist'
      });
    }

    user.watchlist.push({
      coinId,
      coinName: coinName || coinId,
      coinSymbol: coinSymbol || coinId.toUpperCase(),
      addedAt: new Date()
    });

    await user.save();

    res.json({
      success: true,
      watchlist: user.watchlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding to watchlist',
      error: error.message
    });
  }
});

// @route   DELETE /api/search/watchlist/:coinId
// @desc    Remove coin from watchlist
// @access  Private
router.delete('/watchlist/:coinId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    user.watchlist = user.watchlist.filter(item => item.coinId !== req.params.coinId);
    
    await user.save();

    res.json({
      success: true,
      watchlist: user.watchlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing from watchlist',
      error: error.message
    });
  }
});

// @route   GET /api/search/filters
// @desc    Get user's saved filters
// @access  Private
router.get('/filters', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('savedFilters');
    
    res.json({
      success: true,
      filters: user.savedFilters || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching filters',
      error: error.message
    });
  }
});

// @route   POST /api/search/filters
// @desc    Save a filter preset
// @access  Private
router.post('/filters', protect, async (req, res) => {
  try {
    const { name, filters } = req.body;

    if (!name || !filters) {
      return res.status(400).json({
        success: false,
        message: 'Name and filters are required'
      });
    }

    const user = await User.findById(req.user._id);
    
    user.savedFilters.push({
      name,
      filters,
      createdAt: new Date()
    });

    await user.save();

    res.json({
      success: true,
      filters: user.savedFilters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error saving filter',
      error: error.message
    });
  }
});

// @route   DELETE /api/search/filters/:id
// @desc    Delete a saved filter
// @access  Private
router.delete('/filters/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    user.savedFilters = user.savedFilters.filter(
      item => item._id.toString() !== req.params.id
    );
    
    await user.save();

    res.json({
      success: true,
      filters: user.savedFilters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting filter',
      error: error.message
    });
  }
});

export default router;
