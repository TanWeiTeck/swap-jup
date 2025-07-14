import { NextResponse } from 'next/server';

export async function GET() {
  const currencies = {
    USD: { label: 'USD', icon: '🇺🇸' },
    HKD: { label: 'HKD', icon: '🇭🇰' },
    AUD: { label: 'AUD', icon: '🇦🇺' },
    MYR: { label: 'MYR', icon: '🇲🇾' },
    GBP: { label: 'GBP', icon: '🇬🇧' },
    EUR: { label: 'EUR', icon: '🇪🇺' },
    IDR: { label: 'IDR', icon: '🇮🇩' },
    NZD: { label: 'NZD', icon: '🇳🇿' },
    CNY: { label: 'CNY', icon: '🇨🇳' },
    CZK: { label: 'CZK', icon: '🇨🇿' },
    AED: { label: 'AED', icon: '🇦🇪' },
  };

  return NextResponse.json(currencies);
}
