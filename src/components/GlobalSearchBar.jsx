import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaFilter, FaStar, FaRegStar, FaTimes, FaSave } from 'react-icons/fa';
import debounce from 'lodash.debounce';
import { API_ENDPOINTS } from '../config/apiConfig';

const GlobalSearchBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [watchlist, setWatchlist] = useState([]);
  const [savedFilters, setSavedFilters] = useState([]);
  const [showSaveFilter, setShowSaveFilter] = useState(false);
  const [filterName, setFilterName] = useState('');

  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minMarketCap: '',
    maxMarketCap: '',
    minVolume: '',
    maxVolume: '',
    minChange: '',
    maxChange: '',
    sortBy: 'market_cap',
    order: 'desc'
  });

  useEffect(() => {
    fetchWatchlist();
    fetchSavedFilters();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await axios.get(API_ENDPOINTS.SEARCH_WATCHLIST, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWatchlist(response.data.watchlist);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    }
  };

  const fetchSavedFilters = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await axios.get(API_ENDPOINTS.SEARCH_FILTERS, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedFilters(response.data.filters);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const performSearch = async (query, currentFilters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      
      Object.keys(currentFilters).forEach(key => {
        if (currentFilters[key]) {
          params.append(key, currentFilters[key]);
        }
      });

      const response = await axios.get(
        `${API_ENDPOINTS.SEARCH_GLOBAL}?${params.toString()}`
      );
      setSearchResults(response.data.coins || []);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query, currentFilters) => {
      if (query.length >= 2 || Object.values(currentFilters).some(v => v)) {
        performSearch(query, currentFilters);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (searchQuery.length >= 2 || Object.values(filters).some(v => v && v !== 'market_cap' && v !== 'desc')) {
      debouncedSearch(searchQuery, filters);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery, filters, debouncedSearch]);

  const handleCoinClick = (coinId) => {
    navigate(`/coin/${coinId}`);
    setShowResults(false);
    setSearchQuery('');
  };

  const toggleWatchlist = async (coin) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to use watchlist');
        return;
      }

      const isInWatchlist = watchlist.some(w => w.coinId === coin.id);
      
      if (isInWatchlist) {
        await axios.delete(`${API_ENDPOINTS.SEARCH_WATCHLIST}/${coin.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(API_ENDPOINTS.SEARCH_WATCHLIST, {
          coinId: coin.id,
          coinName: coin.name,
          coinSymbol: coin.symbol
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      fetchWatchlist();
    } catch (error) {
      console.error('Watchlist error:', error);
    }
  };

  const saveFilter = async () => {
    if (!filterName) {
      alert('Please enter a filter name');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to save filters');
        return;
      }

      await axios.post(API_ENDPOINTS.SEARCH_FILTERS, {
        name: filterName,
        filters
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFilterName('');
      setShowSaveFilter(false);
      fetchSavedFilters();
      alert('Filter saved successfully!');
    } catch (error) {
      console.error('Error saving filter:', error);
      alert('Error saving filter');
    }
  };

  const applySavedFilter = (savedFilter) => {
    setFilters(savedFilter.filters);
    setShowFilters(false);
  };

  const deleteSavedFilter = async (filterId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_ENDPOINTS.SEARCH_FILTERS}/${filterId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSavedFilters();
    } catch (error) {
      console.error('Error deleting filter:', error);
    }
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      minMarketCap: '',
      maxMarketCap: '',
      minVolume: '',
      maxVolume: '',
      minChange: '',
      maxChange: '',
      sortBy: 'market_cap',
      order: 'desc'
    });
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchResults.length > 0 && setShowResults(true)}
          placeholder="Search cryptocurrencies..."
          className="w-full bg-gray-800 text-white rounded-lg py-3 px-12 focus:outline-none focus:ring-2 focus:ring-crypto-purple"
        />
        <FaSearch className="absolute left-4 top-4 text-gray-400" />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-4 top-3 text-gray-400 hover:text-crypto-purple"
        >
          <FaFilter />
        </button>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="absolute top-full mt-2 w-full bg-gray-800 rounded-lg p-6 shadow-2xl z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Advanced Filters</h3>
            <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-white">
              <FaTimes />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Min Price ($)</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-crypto-purple"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Max Price ($)</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-crypto-purple"
                placeholder="∞"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Min Market Cap ($)</label>
              <input
                type="number"
                value={filters.minMarketCap}
                onChange={(e) => setFilters({...filters, minMarketCap: e.target.value})}
                className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-crypto-purple"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Max Market Cap ($)</label>
              <input
                type="number"
                value={filters.maxMarketCap}
                onChange={(e) => setFilters({...filters, maxMarketCap: e.target.value})}
                className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-crypto-purple"
                placeholder="∞"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Min 24h Change (%)</label>
              <input
                type="number"
                value={filters.minChange}
                onChange={(e) => setFilters({...filters, minChange: e.target.value})}
                className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-crypto-purple"
                placeholder="-100"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Max 24h Change (%)</label>
              <input
                type="number"
                value={filters.maxChange}
                onChange={(e) => setFilters({...filters, maxChange: e.target.value})}
                className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-crypto-purple"
                placeholder="100"
              />
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={clearFilters}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded"
            >
              Clear Filters
            </button>
            <button
              onClick={() => setShowSaveFilter(!showSaveFilter)}
              className="flex-1 bg-crypto-purple hover:bg-purple-700 text-white py-2 rounded flex items-center justify-center"
            >
              <FaSave className="mr-2" /> Save Filter
            </button>
          </div>

          {showSaveFilter && (
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="Filter name..."
                className="flex-1 bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-crypto-purple"
              />
              <button
                onClick={saveFilter}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          )}

          {/* Saved Filters */}
          {savedFilters.length > 0 && (
            <div>
              <h4 className="text-white font-bold mb-2">Saved Filters</h4>
              <div className="space-y-2">
                {savedFilters.map(sf => (
                  <div key={sf._id} className="flex items-center justify-between bg-gray-700 p-2 rounded">
                    <button
                      onClick={() => applySavedFilter(sf)}
                      className="text-white hover:text-crypto-purple flex-1 text-left"
                    >
                      {sf.name}
                    </button>
                    <button
                      onClick={() => deleteSavedFilter(sf._id)}
                      className="text-red-500 hover:text-red-400 ml-2"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search Results */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-gray-800 rounded-lg shadow-2xl max-h-96 overflow-y-auto z-40">
          {loading ? (
            <div className="p-4 text-center text-gray-400">Searching...</div>
          ) : (
            searchResults.map(coin => {
              const isInWatchlist = watchlist.some(w => w.coinId === coin.id);
              return (
                <div
                  key={coin.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700"
                >
                  <div className="flex items-center flex-1" onClick={() => handleCoinClick(coin.id)}>
                    <img src={coin.image} alt={coin.name} className="w-8 h-8 mr-3" />
                    <div>
                      <p className="text-white font-bold">{coin.name}</p>
                      <p className="text-gray-400 text-sm">{coin.symbol.toUpperCase()}</p>
                    </div>
                    <div className="ml-auto mr-4">
                      <p className="text-white font-bold">${coin.current_price?.toLocaleString()}</p>
                      <p className={`text-sm ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {coin.price_change_percentage_24h?.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWatchlist(coin);
                    }}
                    className="text-yellow-500 hover:text-yellow-400"
                  >
                    {isInWatchlist ? <FaStar /> : <FaRegStar />}
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Click outside to close */}
      {(showResults || showFilters) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowResults(false);
            setShowFilters(false);
          }}
        />
      )}
    </div>
  );
};

export default GlobalSearchBar;
