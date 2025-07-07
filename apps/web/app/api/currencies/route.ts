import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    currencies: {
      USD: '🇺🇸',
      HKD: '🇭🇰',
      AUD: '🇦🇺',
      MYR: '🇲🇾',
      GBP: '🇬🇧',
      EUR: '🇪🇺',
      IDR: '🇮🇩',
      NZD: '🇳🇿',
      CNY: '🇨🇳',
      CZK: '🇨🇿',
      AED: '🇦🇪',
    },
  });
}
