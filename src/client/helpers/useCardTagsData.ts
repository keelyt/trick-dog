import { useQuery, useQueryClient } from '@tanstack/react-query';

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

/**
 * A React hook that prefetches tags for a given card.
 * @param deckId The ID of the deck to fetch data for.
 * @param cardId The ID of the card to fetch data for.
 * @returns A function that can be called to prefetch a card's tags.
 */
export function usePrefetchCardTagsData(deckId: number, cardId: number) {
  const queryClient = useQueryClient();

  return () =>
    queryClient.prefetchQuery({
      queryKey: ['decks', deckId, 'cards', cardId, 'tags'],
      queryFn: async (): Promise<number[]> => {
        const result = await fetchWithError<CardTagsResponse>(
          `/api/decks/${deckId}/cards/${cardId}/tags`
        );
        return result.tags;
      },
    });
}
