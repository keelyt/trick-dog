import { useQuery } from '@tanstack/react-query';

import fetchWithError from './fetchWithError';

import type { DeckData, DeckResponse } from '../../types';

/**
 * A React hook that uses React Query to fetch data for a specific deck.
 * @param deckId The ID of the deck to fetch data for.
 * @returns The result of the query.
 */
export default function useDeckData(deckId: number) {
  return useQuery({
    queryKey: ['decks', deckId],
    queryFn: async ({ signal }): Promise<DeckData> => {
      const result = await fetchWithError<DeckResponse>(`/api/decks/${deckId}`, { signal });
      return result.deck;
    },
  });
}
