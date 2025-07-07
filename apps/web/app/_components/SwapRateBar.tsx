import React from 'react';
import { formatCurrencyAmount } from '../_utils/formatCurrency';

type SwapRateBarProps = {
  from: string;
  to: string;
  rate?: number;
  fee: number;
};

export const SwapRateBar: React.FC<SwapRateBarProps> = ({
  from,
  to,
  rate,
  fee,
}) => {
  const displayRate = rate
    ? `1 ${from} ≈ ${formatCurrencyAmount(rate)} ${to}`
    : `1 ${from} ≈ -- ${to}`;

  return (
    <div className="flex items-center justify-between bg-secondary/20 shadow-sm rounded-xl p-4 text-sm">
      <div className="text-muted-foreground">
        Rate <span className="text-foreground">{displayRate}</span>
      </div>
      <div className="bg-secondary text-primary rounded-full text-xs py-1 px-3 font-semibold">
        {fee}% FEE
      </div>
    </div>
  );
};
