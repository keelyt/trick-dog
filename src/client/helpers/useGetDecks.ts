import { useQuery, useQueryClient } from '@tanstack/react-query';

import useFetchWithAuth from './useFetchWithAuth';

import type { DeckData, DecksResponse } from '../../types';

/**
 * A React hook that uses React Query to fetch data for all decks.
 * @returns The result of the query.
 */
export default function useGetDecks() {
  const queryClient = useQueryClient();
  const fetchWithAuth = useFetchWithAuth();

  return useQuery({
    queryKey: ['decks'],
    queryFn: async ({ signal }): Promise<DeckData[]> => {
      const result = await fetchWithAuth<DecksResponse>('/api/decks', { signal });

      result.decks.forEach((deck) => {
        // Add each deck to the cache.
        queryClient.setQueryData(['decks', deck.id], deck);
        // Add the deck's tags to the cache.
        queryClient.setQueryData(['decks', deck.id, 'tags'], deck.tags);
      });

      return result.decks;
    },
  });
}
