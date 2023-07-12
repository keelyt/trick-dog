import { useQuery } from '@tanstack/react-query';

import useFetchWithAuth from './useFetchWithAuth';

import type { CardResponse, CardData } from '../../types';

/**
 * A React hook that uses React Query to fetch data for a specific card.
 * @param deckId The ID of the deck to fetch data for.
 * @param cardId The ID of the card to fetch data for.
 * @returns The result of the query.
 */
export default function useGetCard(deckId: number, cardId: number) {
  const fetchWithAuth = useFetchWithAuth();

  return useQuery({
    queryKey: ['decks', deckId, 'cards', cardId],
    queryFn: async ({ signal }): Promise<CardData> => {
      const result = await fetchWithAuth<CardResponse>(`/api/decks/${deckId}/cards/${cardId}`, {
        signal,
      });
      return result.card;
    },
  });
}
