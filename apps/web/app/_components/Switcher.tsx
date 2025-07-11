import React from 'react';
import { useAtom } from 'jotai';
import {
  fromAmountAtom,
  lastChangedAtom,
  fromCurrencyAtom,
  toCurrencyAtom,
  toAmountAtom,
  debouncedAmountAtom,
} from '../_store/jotai';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@repo/ui/components';

const Switcher = () => {
  const [, setLastChanged] = useAtom(lastChangedAtom);
  const [fromCurrency, setFromCurrency] = useAtom(fromCurrencyAtom);
  const [toCurrency, setToCurrency] = useAtom(toCurrencyAtom);
  const [, setFromAmount] = useAtom(fromAmountAtom);
  const [toAmount] = useAtom(toAmountAtom);
  const [, setDebouncedAmount] = useAtom(debouncedAmountAtom);

  const handleSwitch = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setDebouncedAmount(toAmount);
    setLastChanged('from');
  };

  return (
    <div className="flex justify-center items-center gap-2 relative">
      <hr className="flex-1 opacity-25" />
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSwitch}
        className="bg-secondary/50 rounded-full hover:shadow-md"
      >
        <ArrowUpDown className="w-4 h-4 text-foreground" />
      </Button>
      <hr className="flex-1 opacity-25" />
    </div>
  );
};

export { Switcher };
