import { useInfiniteQuery } from '@tanstack/react-query';

import fetchWithError from './fetchWithError';

import type { CardData, CardsFetchParams } from '../types';

/**
 * Fetches a page of cards for a given deck.
 * @param params The parameters for the fetch.
 * @param [params.signal] The abort signal for the request.
 * @param params.deckId The ID of the deck to fetch cards from.
 * @param [params.before=''] The date to fetch cards before (default is empty string).
 * @returns The card data for the requested page.
 */
export const fetchCards = async ({
  signal,
  deckId,
  before = '',
}: CardsFetchParams): Promise<CardData[]> => {
  if (!deckId) return [];
  const queryString = before ? `?before=${encodeURIComponent(before)}` : '';
  const deckIdParam = encodeURIComponent(deckId);
  return await fetchWithError(`/api/decks/${deckIdParam}/cards${queryString}`, { signal });
};

/**
 * A React hook that uses React Query to fetch an infinite list of card data for a given deck.
 * @param deckId The ID of the deck to fetch cards from.
 * @returns The result of the query.
 */
export default function useCardsInfiniteQuery(deckId: number | undefined) {
  return useInfiniteQuery<CardData[]>({
    queryKey: ['decks', deckId, 'cards'] as const,
    queryFn: async ({ signal, pageParam = '' }: { signal?: AbortSignal; pageParam?: string }) =>
      await fetchCards({ signal, deckId, before: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return;
      // Get the timestamp from the oldest card we have.
      return lastPage[lastPage.length - 1].date_created;
    },
    staleTime: Infinity,
  });
}
