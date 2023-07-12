import { useQuery, useQueryClient } from '@tanstack/react-query';

import useFetchWithAuth from './useFetchWithAuth';

import type { DeckData, DeckResponse } from '../../types';

/**
 * A React hook that uses React Query to fetch data for a specific deck.
 * @param deckId The ID of the deck to fetch data for.
 * @returns The result of the query.
 */
export default function useGetDeck(deckId: number) {
  const queryClient = useQueryClient();
  const fetchWithAuth = useFetchWithAuth();

  return useQuery({
    queryKey: ['decks', deckId],
    queryFn: async ({ signal }): Promise<DeckData> => {
      const result = await fetchWithAuth<DeckResponse>(`/api/decks/${deckId}`, { signal });

      // Add the deck's tags to the cache.
      queryClient.setQueryData(['decks', deckId, 'tags'], result.deck.tags);

      return result.deck;
    },
  });
}
