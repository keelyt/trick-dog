import { useMutation, useQueryClient } from '@tanstack/react-query';

import fetchWithError from './fetchWithError';

import type { DeckData, DeckResponse } from '../../types';

interface RenameDeckParams {
  deckId: number;
  deckName: string;
}

export default function useRenameDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ deckId, deckName }: RenameDeckParams) =>
      fetchWithError<DeckResponse>(`/api/decks/${deckId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deckName }),
      }),
    onSuccess: (data: DeckResponse) => {
      // Update the decks list with the updated deck.
      queryClient.setQueryData(['decks'], (old: DeckData[] | undefined) =>
        old?.map((deck) => (deck.id === data.deck.id ? data.deck : deck))
      );
      // Update the deck in the cache.
      queryClient.setQueryData(['decks', data.deck.id], data.deck);
    },
  });
}
