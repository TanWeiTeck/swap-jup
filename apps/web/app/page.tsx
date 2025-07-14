import React from 'react';
import Swap from './_components/Swap';
import { CurrencyList } from './types';

const page = async () => {
  let currencyList: CurrencyList;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/currencies`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch currencies');
    }

    currencyList = await response.json();
  } catch (error) {
    console.error('Error fetching currencies:', error);
    currencyList = {
      USD: { label: 'USD', icon: '🇺🇸' },
      EUR: { label: 'EUR', icon: '🇪🇺' },
    };
  }

  return <Swap currencyList={currencyList} />;
};

export default page;
