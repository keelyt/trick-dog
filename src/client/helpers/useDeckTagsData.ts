import { useQuery } from '@tanstack/react-query';

import fetchWithError from './fetchWithError';

import type { TagData, TagsResponse } from '../../types';

export default function useDeckTagsData(deckId: number) {
  return useQuery({
    queryKey: ['decks', deckId, 'tags'] as const,
    queryFn: async ({ signal }): Promise<TagData[]> => {
      const result = await fetchWithError<TagsResponse>(`/api/decks/${deckId}/tags`, { signal });
      return result.tags;
    },
  });
}
