import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchCoins } from '../context/coinContext';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 2) {
        setIsSearching(true);
        try {
          const data = await searchCoins(query);
          setResults(data.coins.slice(0, 5));
        } catch (error) {
          console.error('Error searching coins:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setShowResults(false);
    }
  };

  const handleCoinClick = (id) => {
    navigate(`/coin/${id}`);
    setQuery('');
    setShowResults(false);
  };

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          placeholder="Search coins..."
          className="w-full bg-gray-800 text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-crypto-purple"
          onFocus={() => setShowResults(true)}
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <FaTimes />
          </button>
        )}
      </form>

      {showResults && (query.length > 2) && (
        <div className="absolute z-50 mt-2 w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {isSearching ? (
            <div className="p-4 text-center text-gray-400">Searching...</div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((coin) => (
                <li key={coin.id}>
                  <button
                    onClick={() => handleCoinClick(coin.id)}
                    className="flex items-center w-full p-3 hover:bg-gray-700 transition-colors"
                  >
                    <img src={coin.thumb} alt={coin.name} className="w-6 h-6 mr-3" />
                    <div className="text-left">
                      <div className="text-white">{coin.name}</div>
                      <div className="text-gray-400 text-sm">{coin.symbol}</div>
                    </div>
                  </button>
                </li>
              ))}
              <li className="border-t border-gray-700">
                <button
                  onClick={handleSearch}
                  className="w-full p-3 text-crypto-purple hover:bg-gray-700 transition-colors text-center"
                >
                  View all results
                </button>
              </li>
            </ul>
          ) : query.length > 2 ? (
            <div className="p-4 text-center text-gray-400">No results found</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;