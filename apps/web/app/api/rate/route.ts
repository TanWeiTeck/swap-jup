import { NextRequest, NextResponse } from 'next/server';
import Decimal from 'decimal.js';

const ratesPerUSD = {
  HKD: 7.798926,
  AUD: 1.487089,
  MYR: 4.375,
  GBP: 0.761538,
  EUR: 0.899038,
  IDR: 15538.905259,
  NZD: 1.625053,
  CNY: 7.1369,
  CZK: 22.549,
  AED: 3.672815,
  USD: 1,
};

type CurrencyCode = keyof typeof ratesPerUSD;

// To simulate real-time rate changes, added random +-1% variation
function addRandomVariation(rate: number, currency: string): number {
  if (currency === 'USD') {
    return 1;
  }
  const variation = (Math.random() - 0.5) * 0.02;
  return new Decimal(rate).times(new Decimal(1).plus(variation)).toNumber();
}

export async function POST(req: NextRequest) {
  const { from, to, feePercentage, amount, direction } = await req.json();

  let rate = 1;
  if (from === 'USD') {
    rate = addRandomVariation(ratesPerUSD[to as CurrencyCode], to);
  } else if (to === 'USD') {
    rate = addRandomVariation(1 / ratesPerUSD[from as CurrencyCode], from);
  } else {
    rate = addRandomVariation(
      (1 / ratesPerUSD[from as CurrencyCode]) * ratesPerUSD[to as CurrencyCode],
      to
    );
  }

  const rateWithFee = new Decimal(rate)
    .times(new Decimal(1).minus(new Decimal(feePercentage).dividedBy(100)))
    .toNumber();

  const fromUSD =
    from === 'USD'
      ? 1
      : addRandomVariation(1 / ratesPerUSD[from as CurrencyCode], from);
  const toUSD =
    to === 'USD'
      ? 1
      : addRandomVariation(1 / ratesPerUSD[to as CurrencyCode], to);

  let calculatedAmount = null;
  if (amount && direction) {
    try {
      const amountDecimal = new Decimal(amount);
      if (direction === 'from') {
        calculatedAmount = amountDecimal.times(rateWithFee).toString();
      } else if (direction === 'to') {
        calculatedAmount = amountDecimal.dividedBy(rateWithFee).toString();
      }
    } catch (error) {
      console.error('Error calculating amount:', error);
      calculatedAmount = '0';
    }
  }

  // Remain for testing
  await new Promise((resolve) => setTimeout(resolve, 800));

  return NextResponse.json({
    rate: rateWithFee,
    base: 'USD',
    feePercentage,
    originalRate: rate,
    usdRates: {
      from: fromUSD,
      to: toUSD,
    },
    calculatedAmount,
  });
}
