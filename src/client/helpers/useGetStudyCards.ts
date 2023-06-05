import { useQuery } from '@tanstack/react-query';

import fetchWithError from './fetchWithError';

import type { CardData, CardsResponse } from '../../types';

export default function useGetStudyCards(selection: string) {
  return useQuery({
    queryKey: ['study', { selection }],
    queryFn: async ({ signal }): Promise<CardData[]> => {
      const result = await fetchWithError<CardsResponse>(
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
