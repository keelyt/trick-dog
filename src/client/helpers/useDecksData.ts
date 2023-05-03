import { useQuery, useQueryClient } from '@tanstack/react-query';

import fetchWithError from './fetchWithError';

import type { DeckData, DecksResponse } from '../../types';

/**
 * A React hook that uses React Query to fetch data for all decks.
 * @returns The result of the query.
 */
export default function useDecksData() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['decks'],
    queryFn: async ({ signal }): Promise<DeckData[]> => {
      const result = await fetchWithError<DecksResponse>('/api/decks', { signal });

      // Add each deck to the cache.
      result.decks.forEach((deck) => queryClient.setQueryData(['decks', deck.id], deck));

      return result.decks;
    },
  });
}
