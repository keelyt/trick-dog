import { useQuery } from '@tanstack/react-query';

import fetchWithError from './fetchWithError';

import type { CardTagsResponse } from '../../types';

/**
 * A React hook that uses React Query to fetch tag data for a specific deck.
 * @param deckId The ID of the deck to fetch data for.
 * @param cardId The ID of the card to fetch data for.
 * @returns The result of the query.
 */
export default function useCardTagsData(deckId: number, cardId: number) {
  return useQuery({
    queryKey: ['decks', deckId, 'cards', cardId, 'tags'],
    queryFn: async ({ signal }): Promise<number[]> => {
      const result = await fetchWithError<CardTagsResponse>(
        `/api/decks/${deckId}/cards/${cardId}/tags`,
        { signal }
      );
      return result.tags;
    },
  });
}
