import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AppContext } from "../App";
import Navbar from '../components/Navbar';
import { searchCoins } from "../context/coinContext";
import { FaSearch } from 'react-icons/fa';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const { vsCurrency } = useContext(AppContext);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      try {
        setLoading(true);
        const data = await searchCoins(query);
        setResults(data.coins);
        setLoading(false);
      } catch (error) {
        console.error("Error searching coins:", error);
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-crypto-dark text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-days font-bold">Search Results for "{query}"</h1>
          <p className="text-gray-400 mt-2">Found {results.length} results</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-crypto-purple"></div>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(coin => (
              <Link 
                to={`/coin/${coin.id}`} 
                key={coin.id}
                className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors shadow-card hover:shadow-hover"
              >
                <div className="flex items-center mb-4">
                  <img src={coin.large} alt={coin.name} className="w-12 h-12 mr-4" />
                  <div>
                    <h2 className="text-xl font-semibold">{coin.name}</h2>
                    <p className="text-gray-400">{coin.symbol.toUpperCase()}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  Market Cap Rank: {coin.market_cap_rank || 'N/A'}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <FaSearch className="mx-auto text-gray-500 mb-4" size={48} />
            <h2 className="text-2xl mb-4">No results found</h2>
            <p className="text-gray-400">Try searching for a different cryptocurrency</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;