import { useQuery } from '@tanstack/react-query';

import fetchWithError from './fetchWithError';

import type { CardResponse, CardWithTagsData } from '../../types';

/**
 * A React hook that uses React Query to fetch data for a specific card.
 * @param deckId The ID of the deck to fetch data for.
 * @param cardId The ID of the card to fetch data for.
 * @returns The result of the query.
 */
export default function useCardData(deckId: number, cardId: number) {
  return useQuery({
    queryKey: ['decks', deckId, 'cards', cardId],
    queryFn: async ({ signal }): Promise<CardWithTagsData> => {
      const result = await fetchWithError<CardResponse>(`/api/decks/${deckId}/cards/${cardId}`, {
        signal,
      });
      return result.card;
    },
  });
}
