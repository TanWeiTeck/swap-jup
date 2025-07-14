'use client';

import React from 'react';
import Decimal from 'decimal.js';
import { useAtom } from 'jotai';
import { formatCurrencyAmount } from '../_utils/formatCurrency';
import { debouncedAmountAtom, lastChangedAtom } from '../_store/jotai';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  NumberInput,
  Skeleton,
} from '@repo/ui/components';
import { CurrencyList } from '../types';

interface SwapSectionProps {
  currencies: CurrencyList;
  currency: string;
  onCurrencyChange: (val: string) => void;
  amount?: string;
  onAmountChange: (value: string) => void;
  sectionType: 'from' | 'to';
  usdRate?: number;
  isRateLoading?: boolean;
  initialCurrency?: string;
}

export const SwapSection: React.FC<SwapSectionProps> = ({
  currency,
  amount,
  onAmountChange,
  onCurrencyChange,
  currencies,
  sectionType,
  usdRate,
  isRateLoading,
}) => {
  const [lastChanged, setLastChanged] = useAtom(lastChangedAtom);
  const [, setDebouncedAmount] = useAtom(debouncedAmountAtom);

  const isCurrenciesAvailable = React.useMemo(() => {
    return currencies && Object.keys(currencies).length > 0;
  }, [currencies]);

  const usdEquivalent = React.useMemo(() => {
    if (currency === 'USD' && amount) {
      return formatCurrencyAmount(amount, '$');
    }
    if (!usdRate || !amount) {
      return '$ 0.00';
    }

    try {
      const amountDecimal = new Decimal(amount);
      const usdRateDecimal = new Decimal(usdRate);
      return formatCurrencyAmount(amountDecimal.times(usdRateDecimal), '$');
    } catch (error) {
      console.error('Error calculating USD equivalent:', error);
      return 0;
    }
  }, [currency, amount, usdRate]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastChanged(sectionType);
    const stringValue = e.target.value.replace(/,/g, '');
    setDebouncedAmount(stringValue);
  };

  return (
    <div className={''}>
      <div className="text-sm font-medium text-foreground mb-1 pl-2">
        {sectionType === 'from' ? 'Selling' : 'Buying'}
      </div>
      <div
        className={`flex items-center space-x-3 bg-secondary/70 rounded-xl px-4 py-3 ${
          sectionType == lastChanged
            ? 'shadow-lg shadow-background/20 border-1 border-primary'
            : ''
        }`}
      >
        <Select value={currency} onValueChange={onCurrencyChange}>
          {isCurrenciesAvailable ? (
            <SelectTrigger
              className={`min-w-[90px] text-foreground font-bold text-lg rounded-xl border-none focus:ring-0 focus:outline-none focus-visible:ring-0 bg-transparent`}
            >
              <SelectValue />
            </SelectTrigger>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-foreground/50 text-sm">
                No currencies available
              </p>
            </div>
          )}
          <SelectContent>
            {Object.values(currencies).map(({ label, icon }, key) => (
              <SelectItem
                key={`${label}-${key}`}
                value={label ?? ''}
                className="text-base flex items-center gap-2"
              >
                <span>{icon}</span> {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isRateLoading && sectionType !== lastChanged ? (
          <div className="flex justify-end flex-1">
            <Skeleton className="w-30 h-7 opacity-20" />
          </div>
        ) : (
          <NumberInput
            placeholder={'0.00'}
            value={amount}
            onValueChange={(values) => onAmountChange(values.value || '')}
            onChange={handleOnChange}
            className="flex-1 text-right text-foreground bg-transparent outline-none border-none shadow-none px-0 font-bold tracking-tight"
            disabled={!isCurrenciesAvailable}
          />
        )}
      </div>
      <div className="text-right flex justify-end text-gray-500 text-base mt-1 pr-2 font-semibold">
        {isRateLoading &&
        (currency !== 'USD' || sectionType !== lastChanged) ? (
          <Skeleton className="w-28 h-6 opacity-20" />
        ) : (
          usdEquivalent
        )}
      </div>
    </div>
  );
};
