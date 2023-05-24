import { useMutation, useQueryClient } from '@tanstack/react-query';

import fetchWithError from './fetchWithError';
import indexObjectByText from './indexObjectByText';

import type { DeckData, TagData, TagResponse } from '../../types';

interface RenameTagParams {
  deckId: number;
  tagId: number;
  tagName: string;
}

/**
 * A React hook that provides a mutation function for renaming a tag.
 * @returns A mutation function for renaming a tag.
 */
export default function useRenameTag() {
  const queryClient = useQueryClient();

  return useMutation<TagResponse, Error, RenameTagParams, () => unknown>({
    mutationFn: async ({ deckId, tagId, tagName }: RenameTagParams) =>
      fetchWithError<TagResponse>(`/api/decks/${deckId}/tags/${tagId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tagName }),
      }),
    onMutate: async ({ deckId, tagId, tagName }: RenameTagParams) => {
      // Cancel outgoing refetches (so they don't overwrite our optimistic update).
      await queryClient.cancelQueries(['decks', deckId]);
      // Snapshot the previous deck.
      const previousDeck = queryClient.getQueryData(['decks', deckId]);
      // Optimistically update the deck data by renaming the tag.
      queryClient.setQueryData(['decks', deckId], (old: DeckData | undefined) => {
        if (old) {
          const filteredTags = old.tags.filter((tag) => tag.id !== tagId);
          const index = indexObjectByText<TagData, 'tagName'>(filteredTags, tagName, 'tagName');
          return {
            ...old,
            tags: [
              ...filteredTags.slice(0, index),
              { id: tagId, deckId, tagName },
              ...filteredTags.slice(index),
            ],
          };
        }
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
