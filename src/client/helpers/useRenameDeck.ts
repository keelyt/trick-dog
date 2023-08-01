import { useMutation, useQueryClient } from '@tanstack/react-query';

import useFetchWithAuth from './useFetchWithAuth';

import type { DeckData, DeckPatchResponse } from '../../types';

interface RenameDeckParams {
  deckId: number;
  deckName: string;
}

export default function useRenameDeck() {
  const queryClient = useQueryClient();
  const fetchWithAuth = useFetchWithAuth();

  return useMutation({
    mutationFn: async ({ deckId, deckName }: RenameDeckParams) =>
      fetchWithAuth<DeckPatchResponse>(`/api/decks/${deckId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deckName }),
      }),
    onSuccess: (data: DeckPatchResponse) => {
      // Update the decks list with the updated deck.
      queryClient.setQueryData(
        ['decks'],
        (old: DeckData[] | undefined) =>
          old?.map((deck) => (deck.id === data.deck.id ? Object.assign(deck, data.deck) : deck))
      );
      // Update the deck in the cache.
      queryClient.setQueryData(['decks', data.deck.id], (old: DeckData | undefined) => ({
        ...data.deck,
        cardCount: old?.cardCount ?? 0,
        tags: old?.tags ?? [],
      }));
    },
  });
}
