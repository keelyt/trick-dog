import { useMutation, useQueryClient } from '@tanstack/react-query';

import fetchWithError from './fetchWithError';

import type { DeckData } from '../../types';

/**
 * A React hook that provides a mutation function for deleting a deck.
 * @returns A mutation function for deleting a deck.
 */
export default function useDeleteDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (deckId: number) =>
      fetchWithError<DeckData>(`/api/decks/${deckId}`, { method: 'DELETE' }),
    onMutate: async (deckId: number) => {
      // Cancel outgoing refetches (so they don't overwrite our optimistic update).
      await queryClient.cancelQueries(['decks']);
      // Snapshot the previous value.
      const previousDecks = queryClient.getQueryData(['decks']);
      // Optimistically update the deck data by removing the deck.
      queryClient.setQueryData(['decks'], (old: DeckData[] | undefined) =>
        old?.filter((deck) => deck.id !== deckId)
      );
      // Return a rollback function.
      return () => queryClient.setQueryData(['decks'], previousDecks);
    },
    onError: (data, variables, rollback) => {
      // If the mutation fails, roll back the optimistic updates.
      if (rollback) rollback();
    },
    onSettled: () => {
      // After either error or success, invalidate the decks query cache to trigger a refetch.
      // Using void to explicitly mark floating promise as intentionally not awaited.
      void queryClient.invalidateQueries(['decks'], { exact: true });
    },
  });
}
