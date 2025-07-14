import React from 'react';
import Swap from './_components/Swap';
import { getCurrencies } from './api/currencies/route';

const page = async () => {
  const currencyList = await getCurrencies();

  return <Swap currencyList={currencyList} />;
};

export default page;
