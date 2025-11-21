import React from 'react';

// Base skeleton with shimmer animation
export const SkeletonBase = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-700 rounded ${className}`}></div>
);

// Skeleton for text lines
export const SkeletonText = ({ lines = 1, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {[...Array(lines)].map((_, index) => (
      <SkeletonBase 
        key={index} 
        className={`h-4 ${index === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}`} 
      />
    ))}
  </div>
);

// Skeleton for circular elements (avatars, icons)
export const SkeletonCircle = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };
  
  return <SkeletonBase className={`rounded-full ${sizeClasses[size]} ${className}`} />;
};

// Skeleton for cards
export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-gray-800 rounded-xl p-6 ${className}`}>
    <SkeletonText lines={1} className="w-1/3 mb-4" />
    <SkeletonText lines={1} className="w-1/2 h-8" />
  </div>
);

// Skeleton for stat cards
export const SkeletonStatCard = ({ className = '' }) => (
  <div className={`bg-gray-800 rounded-xl p-6 shadow-card ${className}`}>
    <SkeletonText lines={1} className="w-2/3 mb-2 h-3" />
    <SkeletonBase className="w-1/2 h-8" />
  </div>
);

// Skeleton for table rows
export const SkeletonTableRow = ({ columns = 4 }) => (
  <tr className="border-b border-gray-700">
    {[...Array(columns)].map((_, index) => (
      <td key={index} className="px-6 py-4">
        {index === 0 ? (
          <div className="flex items-center gap-3">
            <SkeletonCircle size="sm" />
            <div className="flex-1">
              <SkeletonBase className="h-4 w-24 mb-2" />
              <SkeletonBase className="h-3 w-16" />
            </div>
          </div>
        ) : (
          <SkeletonBase className="h-4 w-20 ml-auto" />
        )}
      </td>
    ))}
  </tr>
);

// Skeleton for full table
export const SkeletonTable = ({ rows = 5, columns = 4, headers = [] }) => (
  <div className="bg-gray-800 rounded-xl overflow-hidden shadow-card">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        {headers.length > 0 && (
          <thead className="bg-gray-700">
            <tr>
              {headers.map((header, index) => (
                <th 
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-gray-700">
          {[...Array(rows)].map((_, index) => (
            <SkeletonTableRow key={index} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Skeleton for coin list item
export const SkeletonCoinCard = ({ className = '' }) => (
  <div className={`bg-gray-800 rounded-xl p-4 ${className}`}>
    <div className="flex items-center gap-4">
      <SkeletonCircle size="md" />
      <div className="flex-1">
        <SkeletonBase className="h-5 w-32 mb-2" />
        <SkeletonBase className="h-4 w-24" />
      </div>
      <div className="text-right">
        <SkeletonBase className="h-5 w-24 mb-2 ml-auto" />
        <SkeletonBase className="h-4 w-16 ml-auto" />
      </div>
    </div>
  </div>
);

// Skeleton for chart
export const SkeletonChart = ({ className = '' }) => (
  <div className={`bg-gray-800 rounded-xl p-6 ${className}`}>
    <SkeletonBase className="h-6 w-40 mb-4" />
    <div className="flex items-end gap-2 h-64">
      {[...Array(12)].map((_, index) => (
        <SkeletonBase 
          key={index} 
          className="flex-1"
          style={{ height: `${Math.random() * 60 + 40}%` }}
        />
      ))}
    </div>
  </div>
);

// Skeleton for news card
export const SkeletonNewsCard = ({ className = '' }) => (
  <div className={`bg-gray-800 rounded-xl overflow-hidden ${className}`}>
    <SkeletonBase className="w-full h-48" />
    <div className="p-4">
      <SkeletonBase className="h-6 w-3/4 mb-3" />
      <SkeletonText lines={3} />
      <SkeletonBase className="h-4 w-32 mt-4" />
    </div>
  </div>
);

// Skeleton for transaction item
export const SkeletonTransactionItem = () => (
  <tr className="hover:bg-gray-700/50 border-b border-gray-700">
    <td className="px-6 py-4 whitespace-nowrap">
      <SkeletonBase className="h-4 w-24 mb-1" />
      <SkeletonBase className="h-3 w-16" />
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <SkeletonBase className="h-6 w-16 rounded-full" />
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <SkeletonBase className="h-4 w-20 mb-1" />
      <SkeletonBase className="h-3 w-12" />
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <SkeletonBase className="h-4 w-24" />
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <SkeletonBase className="h-4 w-20" />
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <SkeletonBase className="h-4 w-24" />
    </td>
    <td className="px-6 py-4">
      <SkeletonBase className="h-4 w-32" />
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <SkeletonBase className="h-4 w-6" />
    </td>
  </tr>
);

export default {
  Base: SkeletonBase,
  Text: SkeletonText,
  Circle: SkeletonCircle,
  Card: SkeletonCard,
  StatCard: SkeletonStatCard,
  Table: SkeletonTable,
  TableRow: SkeletonTableRow,
  CoinCard: SkeletonCoinCard,
  Chart: SkeletonChart,
  NewsCard: SkeletonNewsCard,
  TransactionItem: SkeletonTransactionItem
};
