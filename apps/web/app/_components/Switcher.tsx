import React, { memo, useMemo } from 'react';
import { useAtom } from 'jotai';
import { debounce } from 'lodash';
import {
  debouncedAmountAtom,
  fromAmountAtom,
  fromCurrencyAtom,
  lastChangedAtom,
  toAmountAtom,
  toCurrencyAtom,
} from '../_store/jotai';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@repo/ui/components';

const Switcher = ({ disabled }: { disabled?: boolean }) => {
  const [fromCurrency, setFromCurrency] = useAtom(fromCurrencyAtom);
  const [toCurrency, setToCurrency] = useAtom(toCurrencyAtom);
  const [, setFromAmount] = useAtom(fromAmountAtom);
  const [, setToAmount] = useAtom(toAmountAtom);
  const [, setDebouncedAmount] = useAtom(debouncedAmountAtom);
  const [, setLastChanged] = useAtom(lastChangedAtom);

  const debouncedSwitch = useMemo(
    () =>
      debounce(
        () => {
          const initialAmount = '100';
          setFromCurrency(toCurrency);
          setToCurrency(fromCurrency);
          setFromAmount(initialAmount);
          setToAmount('');
          setDebouncedAmount(initialAmount);
          setLastChanged('from');
        },
        1000,
        { leading: true, trailing: false }
      ),
    [
      fromCurrency,
      setDebouncedAmount,
      setFromAmount,
      setFromCurrency,
      setLastChanged,
      setToAmount,
      setToCurrency,
      toCurrency,
    ]
  );

  return (
    <div className="flex justify-center items-center gap-2 relative">
      <hr className="flex-1 opacity-25" />
      <Button
        variant="ghost"
        size="icon"
        onClick={debouncedSwitch}
        className="bg-secondary/50 rounded-full hover:shadow-md disabled:cursor-pointer"
        disabled={disabled}
      >
        <ArrowUpDown className="w-4 h-4 text-foreground" />
      </Button>
      <hr className="flex-1 opacity-25" />
    </div>
  );
};

export { Switcher };
