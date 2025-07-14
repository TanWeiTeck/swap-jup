'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { toast, Button } from '@repo/ui/components';
import { useAtom } from 'jotai';
import {
  fromCurrencyAtom,
  toCurrencyAtom,
  fromAmountAtom,
  toAmountAtom,
  lastChangedAtom,
  debouncedAmountAtom,
} from '../_store/jotai';
import { useGetRate } from '../_hooks/useGetRate';
import { SwapRateBar } from '../_components/SwapRateBar';
import { SwapSection } from '../_components/SwapSection';
import { Switcher } from '../_components/Switcher';
import { debounce } from 'lodash';
import { CurrencyList } from '../types';
import { formatCurrencyAmount } from '../_utils/formatCurrency';

export default function Swap({ currencyList }: { currencyList: CurrencyList }) {
  const isFirstMount = useRef(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const amount = searchParams.get('amount');
  const lastChangedParam = searchParams.get('lastChanged');

  const [fromCurrency, setFromCurrency] = useAtom(fromCurrencyAtom);
  const [toCurrency, setToCurrency] = useAtom(toCurrencyAtom);
  const [fromAmount, setFromAmount] = useAtom(fromAmountAtom);
  const [toAmount, setToAmount] = useAtom(toAmountAtom);
  const [lastChanged, setLastChanged] = useAtom(lastChangedAtom);
  const [debouncedAmount, setDebouncedAmount] = useAtom(debouncedAmountAtom);

  const { data: rateData, isFetching: isFetchingRate } = useGetRate({
    fromCurrency,
    toCurrency,
    amount: debouncedAmount,
    direction: lastChanged,
    feePercentage: 1,
  });

  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams();
    if (fromCurrency) params.set('from', fromCurrency);
    if (toCurrency) params.set('to', toCurrency);
    if (debouncedAmount) params.set('amount', debouncedAmount);
    if (lastChanged) params.set('lastChanged', lastChanged);

    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [
    fromCurrency,
    toCurrency,
    debouncedAmount,
    lastChanged,
    pathname,
    router,
  ]);

  const setInitialData = useCallback(() => {
    if (!currencyList) return;

    const keys = Object.keys(currencyList);
    if (keys.length > 1) {
      setFromCurrency(from ?? (keys[0] as string));
      setToCurrency(to ?? (keys[1] as string));
      setLastChanged(lastChangedParam ?? 'from');
    }

    if (amount) {
      setDebouncedAmount(amount);
      if (lastChangedParam === 'from') {
        setFromAmount(amount);
      } else if (lastChangedParam === 'to') {
        setToAmount(amount);
      } else {
        setFromAmount(amount);
      }
    }
  }, [
    amount,
    currencyList,
    from,
    lastChangedParam,
    setDebouncedAmount,
    setFromAmount,
    setFromCurrency,
    setLastChanged,
    setToAmount,
    setToCurrency,
    to,
  ]);

  const getShareLink = useCallback(async () => {
    const url = window.location.href;
    const amount = formatCurrencyAmount(debouncedAmount);
    const fromAmount = lastChanged === 'from' ? amount : '';
    const toAmount = lastChanged === 'to' ? amount : '';
    const description =
      toCurrency && fromCurrency
        ? `To Sell ${fromAmount} ${fromCurrency} for ${toAmount} ${toCurrency}`
        : '';

    await navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard', {
      description,
    });
  }, [fromCurrency, toCurrency, debouncedAmount, lastChanged]);

  const handleFromCurrencyChange = useCallback(
    (val: string) => {
      if (val === toCurrency) {
        setToCurrency(fromCurrency);
      }
      setFromCurrency(val);
    },
    [toCurrency, fromCurrency, setToCurrency, setFromCurrency]
  );

  const handleToCurrencyChange = useCallback(
    (val: string) => {
      if (val === fromCurrency) {
        setFromCurrency(toCurrency);
      }
      setToCurrency(val);
    },
    [fromCurrency, toCurrency, setFromCurrency, setToCurrency]
  );

  const handleOnSwap = useCallback(() => {
    toast.promise(swap(), {
      loading: 'Swapping...',
      success: 'Swapped successfully',
      error: 'Failed to swap',
    });
  }, []);

  useEffect(() => {
    if (isFirstMount.current) {
      setInitialData();
      isFirstMount.current = false;
    }
  }, [setInitialData]);

  useEffect(() => {
    if (!isFirstMount.current) {
      debounce(updateUrlParams, 1000)();
    }
  }, [updateUrlParams]);

  useEffect(() => {
    if (!rateData?.calculatedAmount) return;

    if (lastChanged === 'from' && fromAmount) {
      setToAmount(rateData.calculatedAmount);
    } else if (lastChanged === 'to' && toAmount) {
      setFromAmount(rateData.calculatedAmount);
    }
  }, [
    rateData?.calculatedAmount,
    lastChanged,
    fromAmount,
    toAmount,
    setFromAmount,
    setToAmount,
  ]);

  const swap = () => new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-2 sm:p-4">
      <div className="w-full max-w-md bg-foreground/10 rounded-3xl shadow-2xl backdrop-blur-xl p-4 flex flex-col gap-4">
        <div>
          <SwapSection
            currency={fromCurrency}
            amount={fromAmount}
            onAmountChange={setFromAmount}
            onCurrencyChange={handleFromCurrencyChange}
            currencies={currencyList ?? {}}
            sectionType="from"
            usdRate={rateData?.usdRates?.from}
            isRateLoading={isFetchingRate}
          />
          <Switcher disabled={isFetchingRate} />
          <SwapSection
            currency={toCurrency}
            amount={toAmount}
            onAmountChange={setToAmount}
            onCurrencyChange={handleToCurrencyChange}
            currencies={currencyList ?? {}}
            sectionType="to"
            usdRate={rateData?.usdRates?.to}
            isRateLoading={isFetchingRate}
          />
        </div>
        <Button
          className="w-full py-6 text-lg"
          disabled={!fromAmount || !toAmount || isFetchingRate}
          onClick={handleOnSwap}
        >
          Swap
        </Button>
        <SwapRateBar
          from={fromCurrency}
          to={toCurrency}
          rate={rateData?.rate}
          fee={rateData?.feePercentage ?? 0}
        />
      </div>

      <div className="w-full max-w-md flex justify-end mt-2">
        <Button
          variant="outline"
          size="sm"
          className=" text-xs"
          onClick={getShareLink}
        >
          Share Link
        </Button>
      </div>
    </main>
  );
}
