import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../App';

export const useCryptoData = (endpoint, params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { vsCurrency } = useContext(AppContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://api.coingecko.com/api/v3${endpoint}`, {
          params: {
            ...params,
            vs_currency: vsCurrency,
          },
        });
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err.message || 'An error occurred');
        console.error('Error fetching crypto data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, vsCurrency, JSON.stringify(params)]);

  return { data, loading, error };
};