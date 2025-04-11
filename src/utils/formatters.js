export const formatCurrency = (value, currency = 'usd') => {
  const currencySymbols = {
    usd: '$',
    eur: '€',
    gbp: '£',
    jpy: '¥',
    inr: '₹'
  };

  const symbol = currencySymbols[currency] || '$';
  
  return `${symbol}${value.toLocaleString()}`;
};