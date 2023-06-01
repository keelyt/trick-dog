import { useQuery } from '@tanstack/react-query';

import fetchWithError from './fetchWithError';

import type { TagData, TagsResponse } from '../../types';

/**
 * A React hook that uses React Query to fetch tag data for a specific deck.
 * @param deckId The ID of the deck to fetch cards from.
 * @returns The result of the query.
 */
export default function useGetDeckTags(deckId: number) {
  return useQuery({
    queryKey: ['decks', deckId, 'tags'],
    queryFn: async ({ signal }): Promise<TagData[]> => {
      const result = await fetchWithError<TagsResponse>(`/api/decks/${deckId}/tags`, { signal });
      return result.tags;
    },
  });
}
