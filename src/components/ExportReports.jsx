import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaFilePdf, FaFileCsv, FaFileInvoice, FaDownload, FaLightbulb } from 'react-icons/fa';
import { API_ENDPOINTS } from '../config/apiConfig';

const ExportReports = ({ className = '' }) => {
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  };

  // Export Portfolio as PDF
  const exportPortfolioPDF = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.REPORTS_PORTFOLIO, {
        headers: getAuthHeader()
      });

      const { data } = response.data;
      
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.setTextColor(139, 92, 246); // Purple
      doc.text('CryptoX Portfolio Report', 14, 20);
      
      // Date
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
      
      // User Info
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(`User: ${data.user.username}`, 14, 38);
      
      // Summary Section
      doc.setFontSize(14);
      doc.setTextColor(139, 92, 246);
      doc.text('Portfolio Summary', 14, 50);
      
      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.text(`Total Invested: $${data.summary.totalInvested.toFixed(2)}`, 14, 58);
      doc.text(`Current Value: $${data.summary.currentValue.toFixed(2)}`, 14, 65);
      
      const plColor = data.summary.totalProfitLoss >= 0 ? [34, 197, 94] : [239, 68, 68];
      doc.setTextColor(...plColor);
      doc.text(`Total P/L: $${data.summary.totalProfitLoss.toFixed(2)} (${data.summary.totalProfitLossPercentage.toFixed(2)}%)`, 14, 72);
      
      // Portfolio Table
      doc.setTextColor(0);
      const portfolioData = data.portfolio.map(item => [
        item.coinId.toUpperCase(),
        item.amount.toFixed(4),
        `$${item.purchasePrice.toFixed(2)}`,
        `$${item.currentPrice.toFixed(2)}`,
        `$${item.invested.toFixed(2)}`,
        `$${item.currentValue.toFixed(2)}`,
        `${item.profitLossPercentage >= 0 ? '+' : ''}${item.profitLossPercentage.toFixed(2)}%`
      ]);

      autoTable(doc, {
        startY: 80,
        head: [['Coin', 'Amount', 'Buy Price', 'Current', 'Invested', 'Value', 'P/L %']],
        body: portfolioData,
        theme: 'striped',
        headStyles: { fillColor: [139, 92, 246] },
        styles: { fontSize: 9 }
      });

      // Recent Transactions
      if (data.transactions.length > 0) {
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(14);
        doc.setTextColor(139, 92, 246);
        doc.text('Recent Transactions', 14, finalY);

        const transactionData = data.transactions.slice(0, 10).map(tx => [
          new Date(tx.date).toLocaleDateString(),
          tx.type.toUpperCase(),
          tx.coinName,
          tx.amount.toFixed(4),
          `$${tx.price.toFixed(2)}`,
          `$${tx.totalValue.toFixed(2)}`
        ]);

        autoTable(doc, {
          startY: finalY + 5,
          head: [['Date', 'Type', 'Coin', 'Amount', 'Price', 'Total']],
          body: transactionData,
          theme: 'striped',
          headStyles: { fillColor: [139, 92, 246] },
          styles: { fontSize: 8 }
        });
      }

      doc.save(`CryptoX_Portfolio_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report');
    } finally {
      setLoading(false);
    }
  };

  // Export Transactions as CSV
  const exportTransactionsCSV = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.REPORTS_TRANSACTIONS_CSV, {
        headers: getAuthHeader()
      });

      const transactions = response.data.transactions;
      
      // Convert to CSV
      const headers = Object.keys(transactions[0] || {});
      const csvContent = [
        headers.join(','),
        ...transactions.map(row => 
          headers.map(header => {
            const value = row[header];
            return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
          }).join(',')
        )
      ].join('\n');

      // Download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CryptoX_Transactions_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error exporting transactions');
    } finally {
      setLoading(false);
    }
  };

  // Export Alerts as CSV
  const exportAlertsCSV = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.REPORTS_ALERTS_CSV, {
        headers: getAuthHeader()
      });

      const alerts = response.data.alerts;
      
      if (alerts.length === 0) {
        alert('No alerts to export');
        return;
      }

      // Convert to CSV
      const headers = Object.keys(alerts[0]);
      const csvContent = [
        headers.join(','),
        ...alerts.map(row => 
          headers.map(header => {
            const value = row[header];
            return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
          }).join(',')
        )
      ].join('\n');

      // Download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CryptoX_Alerts_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting alerts:', error);
      alert('Error exporting alerts');
    } finally {
      setLoading(false);
    }
  };

  // Generate Tax Report
  const exportTaxReport = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_ENDPOINTS.REPORTS_TAX}?year=${selectedYear}`, {
        headers: getAuthHeader()
      });

      const { taxReport } = response.data;
      
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.setTextColor(139, 92, 246);
      doc.text(`${selectedYear} Tax Report`, 14, 20);
      
      // Disclaimer
      doc.setFontSize(8);
      doc.setTextColor(200, 0, 0);
      doc.text('For informational purposes only. Consult a tax professional.', 14, 28);
      
      // User Info
      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.text(`User: ${taxReport.user.username}`, 14, 38);
      doc.text(`Email: ${taxReport.user.email}`, 14, 44);
      
      // Summary
      doc.setFontSize(14);
      doc.setTextColor(139, 92, 246);
      doc.text('Capital Gains Summary', 14, 56);
      
      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.text(`Short-term Gains: $${taxReport.summary.totalShortTermGains.toFixed(2)}`, 14, 64);
      doc.text(`Long-term Gains: $${taxReport.summary.totalLongTermGains.toFixed(2)}`, 14, 71);
      doc.text(`Total Capital Gains: $${taxReport.summary.totalCapitalGains.toFixed(2)}`, 14, 78);
      doc.text(`Total Taxable Events: ${taxReport.summary.taxableEvents}`, 14, 85);
      
      // Tax Events Table
      if (taxReport.taxEvents.length > 0) {
        const taxData = taxReport.taxEvents.map(event => [
          new Date(event.date).toLocaleDateString(),
          event.coinName,
          event.type,
          event.amount.toFixed(4),
          `$${event.costBasis.toFixed(2)}`,
          `$${event.salePrice.toFixed(2)}`,
          `$${event.capitalGain.toFixed(2)}`,
          `${event.holdingPeriod} days`
        ]);

        autoTable(doc, {
          startY: 95,
          head: [['Date', 'Coin', 'Type', 'Amount', 'Cost', 'Sale', 'Gain', 'Period']],
          body: taxData,
          theme: 'striped',
          headStyles: { fillColor: [139, 92, 246] },
          styles: { fontSize: 8 }
        });
      }

      doc.save(`CryptoX_Tax_Report_${selectedYear}.pdf`);
    } catch (error) {
      console.error('Error generating tax report:', error);
      alert('Error generating tax report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-gray-800 rounded-xl p-6 ${className}`}>
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
        <FaDownload className="mr-3 text-crypto-purple" />
        Export & Reports
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Portfolio PDF */}
        <button
          onClick={exportPortfolioPDF}
          disabled={loading}
          className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center disabled:opacity-50 transition-all"
        >
          <FaFilePdf className="mr-2 text-xl" />
          Portfolio Report (PDF)
        </button>

        {/* Transactions CSV */}
        <button
          onClick={exportTransactionsCSV}
          disabled={loading}
          className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center disabled:opacity-50 transition-all"
        >
          <FaFileCsv className="mr-2 text-xl" />
          Transactions (CSV)
        </button>

        {/* Alerts CSV */}
        <button
          onClick={exportAlertsCSV}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center disabled:opacity-50 transition-all"
        >
          <FaFileCsv className="mr-2 text-xl" />
          Alerts (CSV)
        </button>

        {/* Tax Report */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <FaFileInvoice className="mr-2 text-xl text-white" />
            <span className="text-white font-bold">Tax Report (PDF)</span>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="flex-1 bg-purple-700 text-white rounded px-3 py-2 focus:outline-none"
            >
              {[...Array(5)].map((_, i) => {
                const year = new Date().getFullYear() - i;
                return <option key={year} value={year}>{year}</option>;
              })}
            </select>
            <button
              onClick={exportTaxReport}
              disabled={loading}
              className="bg-purple-800 hover:bg-purple-900 text-white font-bold px-4 py-2 rounded disabled:opacity-50"
            >
              Generate
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="mt-4 text-center">
          <p className="text-crypto-purple animate-pulse">Generating report...</p>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-400 flex items-center justify-start gap-2">
        <FaLightbulb className="text-yellow-400 flex-shrink-0" />
        <p><strong>Tip:</strong> Export your data regularly for backup and tax purposes.</p>
      </div>
    </div>
  );
};

export default ExportReports;
