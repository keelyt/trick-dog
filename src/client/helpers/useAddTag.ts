import { useMutation, useQueryClient } from '@tanstack/react-query';

import indexObjectByText from './indexObjectByText';
import useFetchWithAuth from './useFetchWithAuth';

import type { DeckData, TagData, TagResponse } from '../../types';

interface AddTagParams {
  deckId: number;
  tagName: string;
}

/**
 * A React hook that provides a mutation function for adding a tag.
 * @returns A mutation function for adding a tag.
 */
export default function useAddTag() {
  const queryClient = useQueryClient();
  const fetchWithAuth = useFetchWithAuth();

  return useMutation({
    mutationFn: async ({ deckId, tagName }: AddTagParams) =>
      fetchWithAuth<TagResponse>(`/api/decks/${deckId}/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tagName }),
      }),
    onSuccess: (data) => {
      // Add the new tag to the cache.
      queryClient.setQueryData(['decks', data.tag.deckId], (old: DeckData | undefined) => {
        if (old) {
          const index = indexObjectByText<TagData, 'tagName'>(
            old.tags,
            data.tag.tagName,
            'tagName'
          );
          return {
            ...old,
            tags: [...old.tags.slice(0, index), data.tag, ...old.tags.slice(index)],
          };
        }
      });
    },
    onSettled: (data, error, variables) => {
      // After either error or success, invalidate the decks and deck tags query cache to trigger a refetch.
      // Using void to explicitly mark floating promise as intentionally not awaited.
      void queryClient.invalidateQueries(['decks', variables.deckId, 'tags']);
      void queryClient.invalidateQueries(['decks'], { exact: true });
    },
  });
}
