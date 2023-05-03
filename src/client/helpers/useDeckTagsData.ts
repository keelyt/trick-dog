/*
 * This hook is not currently being used in the application,
 * but it has been kept for possible future use or as a reference.
 * It can be deleted if it's no longer needed.
 */

import { useQuery } from '@tanstack/react-query';

import fetchWithError from './fetchWithError';

import type { TagData, TagsResponse } from '../../types';

/**
 * A React hook that uses React Query to fetch tag data for a specific deck.
 * @param deckId The ID of the deck to fetch cards from.
 * @returns The result of the query.
 */
export default function useDeckTagsData(deckId: number) {
  return useQuery({
    queryKey: ['decks', deckId, 'tags'],
    queryFn: async ({ signal }): Promise<TagData[]> => {
      const result = await fetchWithError<TagsResponse>(`/api/decks/${deckId}/tags`, { signal });
      return result.tags;
    },
  });
}
