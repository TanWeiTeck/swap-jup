import Decimal from 'decimal.js';

export const formatCurrencyAmount = (amount: number | string): string => {
  try {
    const decimalAmount = new Decimal(amount);

    return decimalAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } catch (error) {
    console.error('Error formatting currency amount:', error);
    return '0.00';
  }
};
