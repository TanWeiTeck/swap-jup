import { useQuery } from '@tanstack/react-query';

interface RateDataParams {
  fromCurrency: string;
  toCurrency: string;
  feePercentage: number;
  amount?: string;
  direction?: string;
}

interface RateData {
  rate: number;
  feePercentage: number;
  originalRate: number;
  usdRates: {
    from: number;
    to: number;
  };
  calculatedAmount?: string;
}

export const useGetRate = ({
  fromCurrency,
  toCurrency,
  feePercentage,
  amount,
  direction,
}: RateDataParams) => {
  const enabled = !!fromCurrency && !!toCurrency && !!feePercentage && !!amount;

  return useQuery<RateData>({
    queryKey: [
      'rate',
      fromCurrency,
      toCurrency,
      feePercentage,
      amount,
      direction,
    ],
    queryFn: async ({ signal }) => {
      const res = await fetch('/api/rate', {
        method: 'POST',
        body: JSON.stringify({
          from: fromCurrency,
          to: toCurrency,
          feePercentage,
          amount,
          direction,
        }),
        signal,
      });
      if (!res.ok) throw new Error('Failed to fetch rate');
      return res.json();
    },
    refetchInterval: 5 * 1000,
    enabled,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
