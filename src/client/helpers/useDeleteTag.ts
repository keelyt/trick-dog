import { useMutation, useQueryClient } from '@tanstack/react-query';

import fetchWithError from './fetchWithError';

import type { DeckData, TagResponse } from '../../types';

interface DeleteTagParams {
  deckId: number;
  tagId: number;
}

/**
 * A React hook that provides a mutation function for deleting a tag.
 * @returns A mutation function for deleting a tag.
 */
export default function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ deckId, tagId }: DeleteTagParams) =>
      fetchWithError<TagResponse>(`/api/decks/${deckId}/tags/${tagId}`, { method: 'DELETE' }),
    onMutate: async ({ deckId, tagId }: DeleteTagParams) => {
      // Cancel outgoing refetches (so they don't overwrite our optimistic update).
      await queryClient.cancelQueries(['decks', deckId]);
      // Snapshot the previous deck.
      const previousDeck = queryClient.getQueryData(['decks', deckId]);
      // Optimistically update the deck data by removing the deck.
      queryClient.setQueryData(['decks', deckId], (old: DeckData | undefined) => {
        if (old) return { ...old, tags: old.tags.filter((tag) => tag.id !== tagId) };
      });
      // Return a rollback function.
      return () => queryClient.setQueryData(['decks', deckId], previousDeck);
    },
    onError: (data, variables, rollback) => {
      // If the mutation fails, roll back the optimistic updates.
      if (rollback) rollback();
    },
    onSettled: (data, error, variables) => {
      // After either error or success, invalidate the decks and deck tags query cache to trigger a refetch.
      // Using void to explicitly mark floating promise as intentionally not awaited.
      void queryClient.invalidateQueries(['decks', variables.deckId, 'tags']);
      void queryClient.invalidateQueries(['decks'], { exact: true });
    },
  });
}
