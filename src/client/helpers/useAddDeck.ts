import { useMutation, useQueryClient } from '@tanstack/react-query';

import indexObjectByText from './indexObjectByText';
import useFetchWithAuth from './useFetchWithAuth';
import { getCardsQueryKey } from './useGetInfiniteCards';

import type { DeckData, DeckResponse } from '../../types';

export default function useAddDeck() {
  const queryClient = useQueryClient();
  const fetchWithAuth = useFetchWithAuth();

  return useMutation({
    mutationFn: async (deckName: string) =>
      fetchWithAuth<DeckResponse>('/api/decks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deckName }),
      }),
    onMutate: async (deckName: string) => {
      // Cancel outgoing refetches (so they don't overwrite our optimistic update).
      await queryClient.cancelQueries(['decks']);
      // Snapshot the previous value.
      const previousDecks = queryClient.getQueryData(['decks']);
      // Create optimistic deck, using a random number for the ID.
      const optimisticDeck: DeckData = {
        id: Math.random(),
        deckName: deckName,
        cardCount: 0,
        tags: [],
      };
      // Optimistically update the deck list with the new deck.
      queryClient.setQueryData(['decks'], (old: DeckData[] | undefined) => {
        if (!old) return [optimisticDeck];
        const index = indexObjectByText<DeckData, 'deckName'>(old, deckName, 'deckName');
        return [...old.slice(0, index), optimisticDeck, ...old.slice(index)];
      });
      // Return context with the optimistic deck.
      return { optimisticDeck, previousDecks };
    },
    onError: (data, variables, context) => {
      // If the mutation fails, roll back the optimistic updates.
      queryClient.setQueryData(['decks'], context?.previousDecks);
    },
    onSuccess: (data: DeckResponse, variables, context) => {
      // Replace optimistic deck in deck list with actual deck.
      queryClient.setQueryData(['decks'], (old: DeckData[] | undefined) =>
        old?.map((deck) => (deck.id === context?.optimisticDeck.id ? data.deck : deck))
      );
      // Add new deck to the cache.
      queryClient.setQueryData(['decks', data.deck.id], data.deck);
      // New decks will not have any cards.
      queryClient.setQueryData(
        getCardsQueryKey({ deckId: data.deck.id, tagId: null, search: '' }),
        { pages: [[]], pageParams: [null] }
      );
    },
    onSettled: () => {
      // After either error or success, invalidate the decks query cache to trigger a refetch.
      // Using void to explicitly mark floating promise as intentionally not awaited.
      void queryClient.invalidateQueries(['decks'], { exact: true });
    },
  });
}
