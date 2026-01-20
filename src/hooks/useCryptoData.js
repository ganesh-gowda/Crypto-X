import { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AppContext } from '../App';

const CACHE_DURATION = 5 * 60 * 1000;

export const useCryptoData = (endpoint, params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { vsCurrency } = useContext(AppContext);
  const cacheRef = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const cacheKey = `${endpoint}-${vsCurrency}-${JSON.stringify(params)}`;
        const cachedData = cacheRef.current[cacheKey];
        
        if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
          setData(cachedData.data);
          setLoading(false);
          return;
        }
        
        const response = await axios.get(`https://api.coingecko.com/api/v3${endpoint}`, {
          params: {
            ...params,
            vs_currency: vsCurrency,
          },
        });
        
        setData(response.data);
        cacheRef.current[cacheKey] = {
          data: response.data,
          timestamp: Date.now()
        };
        setError(null);
      } catch (err) {
        if (err.response?.status === 429) {
          setError('API rate limit exceeded. Please try again later.');
        } else {
          setError(err.message || 'An error occurred');
        }
        console.error('Error fetching crypto data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, vsCurrency, JSON.stringify(params)]);

  return { data, loading, error };
};