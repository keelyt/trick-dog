import { useQuery } from '@tanstack/react-query';

import useFetchWithAuth from './useFetchWithAuth';

import type { CardData, CardsResponse } from '../../types';

export default function useGetStudyCards(selection: string) {
  const fetchWithAuth = useFetchWithAuth();

  return useQuery({
    queryKey: ['study', { selection }],
    queryFn: async ({ signal }): Promise<CardData[]> => {
      const result = await fetchWithAuth<CardsResponse>(
        `/api/study?sel=${encodeURIComponent(selection)}`,
        {
          signal,
        }
      );
      return result.cards;
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    cacheTime: 0,
  });
}
