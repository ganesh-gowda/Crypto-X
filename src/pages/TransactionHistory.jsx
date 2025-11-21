import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { transactionAPI } from '../services/transactionApi';
import { FaDownload, FaFilter, FaTrash, FaArrowUp, FaArrowDown, FaExchangeAlt } from 'react-icons/fa';
import { SkeletonStatCard, SkeletonTransactionItem } from '../components/Skeleton';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    coinId: '',
    startDate: '',
    endDate: '',
    searchTerm: ''
  });

  useEffect(() => {
    fetchTransactions();
    fetchStats();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, filters]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionAPI.getAll();
      setTransactions(response.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await transactionAPI.getStats();
      setStats(response.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.coinName.toLowerCase().includes(term) ||
        t.coinSymbol.toLowerCase().includes(term)
      );
    }

    if (filters.startDate) {
      filtered = filtered.filter(t => new Date(t.date) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      filtered = filtered.filter(t => new Date(t.date) <= new Date(filters.endDate));
    }

    setFilteredTransactions(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionAPI.delete(id);
        setTransactions(transactions.filter(t => t._id !== id));
        fetchStats(); // Refresh stats after deletion
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Failed to delete transaction');
      }
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Coin', 'Symbol', 'Amount', 'Price', 'Total Value', 'Notes'];
    const csvData = filteredTransactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.type.toUpperCase(),
      t.coinName,
      t.coinSymbol.toUpperCase(),
      t.amount,
      t.price,
      t.totalValue,
      t.notes || ''
    ]);

    const csv = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'buy':
        return <FaArrowDown className="text-crypto-accent" />;
      case 'sell':
        return <FaArrowUp className="text-crypto-warning" />;
      case 'transfer':
        return <FaExchangeAlt className="text-blue-400" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'buy':
        return 'text-crypto-accent bg-green-900/20';
      case 'sell':
        return 'text-crypto-warning bg-red-900/20';
      case 'transfer':
        return 'text-blue-400 bg-blue-900/20';
      default:
        return 'text-gray-400 bg-gray-900/20';
    }
  };

  return (
    <div className="min-h-screen bg-crypto-dark">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-days font-bold">Transaction History</h1>
          <button
            onClick={exportToCSV}
            className="bg-crypto-purple hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
            disabled={filteredTransactions.length === 0}
          >
            <FaDownload /> Export CSV
          </button>
        </div>

        {/* Statistics Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
          </div>
        ) : stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800 rounded-xl p-6 shadow-card">
              <h3 className="text-gray-400 text-sm mb-2">Total Transactions</h3>
              <p className="text-2xl font-bold">{stats.totalTransactions}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 shadow-card">
              <h3 className="text-gray-400 text-sm mb-2">Total Buys</h3>
              <p className="text-2xl font-bold text-crypto-accent">{stats.totalBuys}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 shadow-card">
              <h3 className="text-gray-400 text-sm mb-2">Total Sells</h3>
              <p className="text-2xl font-bold text-crypto-warning">{stats.totalSells}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 shadow-card">
              <h3 className="text-gray-400 text-sm mb-2">Total Invested</h3>
              <p className="text-2xl font-bold">${stats.totalInvested.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-crypto-purple" />
            <h2 className="text-xl font-semibold">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Search coin..."
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-crypto-purple"
            />
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-crypto-purple"
            >
              <option value="">All Types</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
              <option value="transfer">Transfer</option>
            </select>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-crypto-purple"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-crypto-purple"
              placeholder="End Date"
            />
            <button
              onClick={() => setFilters({ type: '', coinId: '', startDate: '', endDate: '', searchTerm: '' })}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        {loading ? (
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Coin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Notes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {[...Array(10)].map((_, index) => (
                    <SkeletonTransactionItem key={index} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <h2 className="text-2xl mb-4">No transactions found</h2>
            <p className="text-gray-400 mb-6">
              {transactions.length === 0 
                ? "Start adding coins to your portfolio to see your transaction history."
                : "No transactions match your current filters."
              }
            </p>
            <Link 
              to="/portfolio"
              className="inline-block bg-crypto-purple hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              Go to Portfolio
            </Link>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Coin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Notes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          {new Date(transaction.date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(transaction.date).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(transaction.type)}`}>
                          {getTypeIcon(transaction.type)}
                          {transaction.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{transaction.coinName}</div>
                        <div className="text-sm text-gray-400">{transaction.coinSymbol.toUpperCase()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction.amount} {transaction.coinSymbol.toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${transaction.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">
                        ${transaction.totalValue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-400 max-w-xs truncate">
                          {transaction.notes || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(transaction._id)}
                          className="text-red-400 hover:text-red-300"
                          title="Delete transaction"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary */}
        {filteredTransactions.length > 0 && (
          <div className="mt-4 text-center text-gray-400">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
