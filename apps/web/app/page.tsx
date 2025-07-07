'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { toast } from '@repo/ui/components/sonner';
import { Button } from '@repo/ui/components/button';
import { useAtom } from 'jotai';
import {
  fromCurrencyAtom,
  toCurrencyAtom,
  fromAmountAtom,
  toAmountAtom,
  lastChangedAtom,
  debouncedAmountAtom,
} from './_store/jotai';
import { useGetRate } from './_hooks/useGetRate';
import { useGetCurrencyList } from './_hooks/useCurrenciesData';
import { SwapRateBar } from './_components/SwapRateBar';
import { SwapSection } from './_components/SwapSection';
import { Switcher } from './_components/Switcher';

export default function Page() {
  const isFirstMount = useRef(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [fromCurrency, setFromCurrency] = useAtom(fromCurrencyAtom);
  const [toCurrency, setToCurrency] = useAtom(toCurrencyAtom);
  const [fromAmount, setFromAmount] = useAtom(fromAmountAtom);
  const [toAmount, setToAmount] = useAtom(toAmountAtom);
  const [lastChanged, setLastChanged] = useAtom(lastChangedAtom);
  const [debouncedAmount, setDebouncedAmount] = useAtom(debouncedAmountAtom);

  const { data: currencyList, isLoading: isLoadingCurrencyList } =
    useGetCurrencyList();
  const { data: rateData, isFetching: isFetchingRate } = useGetRate({
    fromCurrency,
    toCurrency,
    amount: debouncedAmount,
    direction: lastChanged,
    feePercentage: 1,
  });

  const getInitialDataUrl = useCallback(() => {
    const f = searchParams.get('from');
    const t = searchParams.get('to');
    const amount = searchParams.get('amount');
    const lastChangedParam = searchParams.get('lastChanged');
    return { from: f, to: t, amount: amount, lastChanged: lastChangedParam };
  }, [searchParams]);

  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams();
    if (fromCurrency) params.set('from', fromCurrency);
    if (toCurrency) params.set('to', toCurrency);

    if (lastChanged === 'from' && fromAmount) {
      params.set('amount', fromAmount);
    } else if (lastChanged === 'to' && toAmount) {
      params.set('amount', toAmount);
    }

    if (lastChanged) params.set('lastChanged', lastChanged);

    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [
    fromCurrency,
    toCurrency,
    fromAmount,
    toAmount,
    lastChanged,
    pathname,
    router,
  ]);

  const setInitialData = useCallback(() => {
    if (!currencyList?.currencies) return;

    const keys = Object.keys(currencyList.currencies);
    const {
      from,
      to,
      amount,
      lastChanged: lastChangedParam,
    } = getInitialDataUrl();

    if (keys.length > 1) {
      setFromCurrency(from ?? (keys[0] as string));
      setToCurrency(to ?? (keys[1] as string));
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

    if (lastChangedParam === 'from' || lastChangedParam === 'to') {
      setLastChanged(lastChangedParam);
    }
  }, [
    currencyList?.currencies,
    getInitialDataUrl,
    setFromAmount,
    setToAmount,
    setFromCurrency,
    setToCurrency,
    setDebouncedAmount,
    setLastChanged,
  ]);

  const getShareLink = useCallback(async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard', {
      description: `To Sell ${debouncedAmount} ${fromCurrency} for ${toCurrency}`,
    });
  }, [fromCurrency, toCurrency, debouncedAmount]);

  useEffect(() => {
    if (isFirstMount.current && currencyList?.currencies) {
      setInitialData();
      isFirstMount.current = false;
    }
  }, [currencyList?.currencies, setInitialData]);

  useEffect(() => {
    if (!isFirstMount.current) {
      updateUrlParams();
    }
  }, [fromCurrency, toCurrency, fromAmount, toAmount, updateUrlParams]);

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
            onCurrencyChange={(val) => {
              if (val === toCurrency) {
                setToCurrency(fromCurrency);
              }
              setFromCurrency(val);
            }}
            currencies={currencyList?.currencies ?? {}}
            sectionType="from"
            usdRate={rateData?.usdRates?.from}
            isCurrenciesLoading={isLoadingCurrencyList}
            isRateLoading={isFetchingRate}
          />
          <Switcher />
          <SwapSection
            currency={toCurrency}
            amount={toAmount}
            onAmountChange={setToAmount}
            onCurrencyChange={(val) => {
              if (val === fromCurrency) {
                setFromCurrency(toCurrency);
              }
              setToCurrency(val);
            }}
            currencies={currencyList?.currencies ?? {}}
            sectionType="to"
            usdRate={rateData?.usdRates?.to}
            isCurrenciesLoading={isLoadingCurrencyList}
            isRateLoading={isFetchingRate}
          />
        </div>
        <Button
          className="w-full py-6 text-lg"
          disabled={!fromAmount || !toAmount || isFetchingRate}
          onClick={() => {
            toast.promise(swap(), {
              loading: 'Swapping...',
              success: 'Swapped successfully',
              error: 'Failed to swap',
            });
          }}
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
