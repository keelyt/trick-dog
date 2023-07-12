import { useMutation, useQueryClient } from '@tanstack/react-query';

import indexObjectByText from './indexObjectByText';
import useFetchWithAuth from './useFetchWithAuth';

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
  const fetchWithAuth = useFetchWithAuth();

  return useMutation({
    mutationFn: async ({ deckId, tagId, tagName }: RenameTagParams) =>
      fetchWithAuth<TagResponse>(`/api/decks/${deckId}/tags/${tagId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tagName }),
      }),
    onSuccess: (data) => {
      // Rename the tag in the cache.
      queryClient.setQueryData(['decks', data.tag.deckId], (old: DeckData | undefined) => {
        if (old) {
          const filteredTags = old.tags.filter((tag) => tag.id !== data.tag.id);
          const index = indexObjectByText<TagData, 'tagName'>(
            filteredTags,
            data.tag.tagName,
            'tagName'
          );
          return {
            ...old,
            tags: [...filteredTags.slice(0, index), data.tag, ...filteredTags.slice(index)],
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
