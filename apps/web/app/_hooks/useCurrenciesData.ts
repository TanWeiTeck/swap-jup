import { useQuery } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';

interface CurrenciesData {
  currencies: Record<string, string>;
}

export const useGetCurrencyList = () => {
  return useQuery<CurrenciesData>({
    queryKey: ['currencies'],
    queryFn: async () => {
      const res = await fetch('/api/currencies');
      if (!res.ok) throw new Error('Failed to fetch currencies');
      return res.json();
    },
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
};
