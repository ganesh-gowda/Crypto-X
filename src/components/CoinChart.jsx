import React, { useState, useEffect } from 'react';
import { fetchChartData } from '../services/api';
// Chart library imports (e.g., Chart.js, Recharts, etc.)

const CoinChart = ({ coinId, days = 7 }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadChartData = async () => {
      try {
        setLoading(true);
        const data = await fetchChartData(coinId, days);
        setChartData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadChartData();
  }, [coinId, days]);
  
  // Render your chart using the data
  return (
    <div>
      {loading && <p>Loading chart...</p>}
      {error && <p>Error loading chart: {error}</p>}
      {chartData && (
        // Render your chart component here
        <div>
          {/* Your chart implementation */}
        </div>
      )}
    </div>
  );
};

export default CoinChart;