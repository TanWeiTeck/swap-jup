import Decimal from 'decimal.js';

export const formatCurrencyAmount = (
  amount: number | string | Decimal,
  symbol?: string
): string => {
  try {
    const decimalAmount = new Decimal(amount);

    return `${symbol ?? ''} ${decimalAmount
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  } catch (error) {
    console.error('Error formatting currency amount:', error);
    return `${symbol ?? ''} ${'0.00'}`;
  }
};
