import React from 'react';
import Decimal from 'decimal.js';
import { useAtom } from 'jotai';
import { formatCurrencyAmount } from '../_utils/formatCurrency';
import { NumberInput } from '@repo/ui/components/numberInput';
import { Skeleton } from '@repo/ui/components/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select';
import { debouncedAmountAtom, lastChangedAtom } from '../_store/jotai';

interface SwapSectionProps {
  currency: string;
  amount?: string | number;
  onAmountChange: (value: string) => void;
  onCurrencyChange: (val: string) => void;
  currencies: Record<string, string>;
  sectionType: 'from' | 'to';
  usdRate?: number;
  isCurrenciesLoading?: boolean;
  isRateLoading?: boolean;
}

export const SwapSection: React.FC<SwapSectionProps> = ({
  currency,
  amount,
  onAmountChange,
  onCurrencyChange,
  currencies,
  sectionType,
  usdRate,
  isCurrenciesLoading,
  isRateLoading,
}) => {
  const [lastChanged, setLastChanged] = useAtom(lastChangedAtom);
  const [, setDebouncedAmount] = useAtom(debouncedAmountAtom);

  const isCurrenciesAvailable = React.useMemo(() => {
    return currencies && Object.entries(currencies).length > 0;
  }, [currencies]);

  const usdEquivalent = React.useMemo(() => {
    if (!usdRate || !amount) return 0;

    try {
      const amountDecimal = new Decimal(amount.toString());
      const usdRateDecimal = new Decimal(usdRate);
      return amountDecimal.times(usdRateDecimal).toNumber();
    } catch (error) {
      console.error('Error calculating USD equivalent:', error);
      return 0;
    }
  }, [usdRate, amount]);

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
        {isCurrenciesLoading ? (
          <Skeleton className="w-18 h-6 opacity-20" />
        ) : (
          <Select value={currency} onValueChange={onCurrencyChange}>
            {isCurrenciesAvailable ? (
              <SelectTrigger
                className={`min-w-[90px] text-foreground font-bold text-lg rounded-xl border-none focus:ring-0 focus:outline-none focus-visible:ring-0 bg-transparent`}
              >
                <SelectValue placeholder="select" />
              </SelectTrigger>
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-foreground/50 text-sm">
                  No currencies available
                </p>
              </div>
            )}
            <SelectContent>
              {Object.entries(currencies).map(([key, icon]) => (
                <SelectItem
                  key={key}
                  value={key}
                  className="text-base flex items-center gap-2"
                >
                  <span>{icon}</span> {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
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
        ) : usdEquivalent > 0 ? (
          `$${formatCurrencyAmount(usdEquivalent)}`
        ) : (
          '0.00'
        )}
      </div>
    </div>
  );
};
