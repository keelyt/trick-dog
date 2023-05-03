import { useMutation, useQueryClient } from '@tanstack/react-query';

import fetchWithError from './fetchWithError';
import { getCardsQueryKey } from './useInfiniteCards';

import type { DeckData, DeckResponse } from '../../types';

export default function useAddDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (deckName: string) =>
      fetchWithError<DeckResponse>('/api/decks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deck_name: deckName }),
      }),
    onMutate: async (deckName: string) => {
      // Cancel outgoing refetches (so they don't overwrite our optimistic update).
      await queryClient.cancelQueries(['decks']);
      // Snapshot the previous value.
      const previousDecks = queryClient.getQueryData(['decks']);
      // Create optimistic deck, using a random number for the ID.
      const optimisticDeck: DeckData = { id: Math.random(), deck_name: deckName, card_count: 0 };
      // Optimistically update the deck list with the new deck.
      // TODO: Since this is adding one element to a sorted array, could be done more efficiently.
      queryClient.setQueryData(['decks'], (old: DeckData[] | undefined) =>
        [...(old ?? []), optimisticDeck].sort((a, b) => {
          if (a.deck_name.toLowerCase() > b.deck_name.toLowerCase()) return 1;
          if (b.deck_name.toLowerCase() > a.deck_name.toLowerCase()) return -1;
          return 0;
        })
      );
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
      // New decks will not have any tags.
      queryClient.setQueryData(['decks', data.deck.id, 'tags'], []);
    },
    onSettled: () => {
      // After either error or success, invalidate the decks query cache to trigger a refetch.
      // Using void to explicitly mark floating promise as intentionally not awaited.
      void queryClient.invalidateQueries(['decks'], { exact: true });
    },
  });
}
