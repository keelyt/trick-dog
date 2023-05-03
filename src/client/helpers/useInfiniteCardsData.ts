import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

import fetchWithError from './fetchWithError';

import type { CardData } from '../../types';

// Hardcoded page limit of 10 cards per page.
const LIMIT = 10;

interface QueryKeyParams {
  deckId: number;
  tagId: number | null;
  search: string;
  limit?: number;
}

interface FetchParams {
  signal?: AbortSignal;
  deckId?: number;
  tagId?: number | null;
  search?: string;
  before?: string;
  limit?: number;
}

interface InfiniteQueryParams {
  deckId: number;
  tagId: number | null;
  search?: string;
  limit?: number;
}

/**
Generates a query key for the list of cards of a given deck with the specified parameters.
@param params The parameters for the query key.
@param params.deckId The ID of the deck to fetch cards from.
@param params.tagId The ID of the tag to filter cards by. Can be null.
@param params.search The search query to filter cards by.
@param [params.limit=10] The number of cards to limit the results to. Defaults to 10.
@returns The generated query key.
*/
export function getCardsQueryKey({ deckId, tagId, search, limit = LIMIT }: QueryKeyParams) {
  return ['decks', deckId, 'cards', { tagId, search, limit }];
}

/**
 * Fetches a page of cards for a given deck.
 * @param params The parameters for the fetch.
 * @param [params.signal] The abort signal for the request.
 * @param params.deckId The ID of the deck to fetch cards from.
 * @param [params.tagId=null] The ID of the tag to filter cards by. Defaults to null.
 * @param [params.search=''] The search query to filter cards by. Defaults to empty string.
 * @param [params.before=''] The date to fetch cards before. Defaults to empty string.
 * @param [params.limit] The number of cards to limit the results to. Optional.
 * @returns The card data for the requested page.
 */
export const fetchCards = async ({
  signal,
  deckId,
  tagId = null,
  search = '',
  before = '',
  limit,
}: FetchParams): Promise<CardData[]> => {
  if (!deckId) return [];

  const query = [];
  if (tagId) query.push(`tag=${encodeURIComponent(tagId)}`);
  if (search) query.push(`q=${encodeURIComponent(search)}`);
  if (before) query.push(`before=${encodeURIComponent(before)}`);
  if (limit) query.push(`limit=${encodeURIComponent(limit)}`);
  const deckIdParam = encodeURIComponent(deckId);

  const response = await fetchWithError<{ cards: CardData[] }>(
    `/api/decks/${deckIdParam}/cards${query.length ? '?' + query.join('&') : ''}`,
    {
      signal,
    }
  );

  return response.cards;
};

/**
 * A React hook that uses React Query to fetch an infinite list of card data for a given deck.
 * @param params The parameters for the fetch.
 * @param params.deckId The ID of the deck to fetch cards from.
 * @param params.tagId The ID of the tag to filter cards by. Can be null.
 * @param [params.search=''] The search query to filter cards by. Defaults to empty string.
 * @param [params.limit=10] The number of cards to limit the results to. Defaults to 10.
 * @returns The result of the query.
 */
export function useInfiniteCards({
  deckId,
  tagId,
  search = '',
  limit = LIMIT,
}: InfiniteQueryParams) {
  const queryClient = useQueryClient();
  return useInfiniteQuery({
    queryKey: getCardsQueryKey({ deckId, tagId, search, limit }),
    queryFn: async ({ signal, pageParam = '' }: { signal?: AbortSignal; pageParam?: string }) => {
      const cards = await fetchCards({ signal, deckId, tagId, search, before: pageParam, limit });

      // Add each individual card to the cache.
      cards.forEach((card) => queryClient.setQueryData(['decks', deckId, 'cards', card.id], card));

      return cards;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return;
      // Get the timestamp from the oldest card we have.
      return lastPage[lastPage.length - 1].date_created;
    },
    staleTime: Infinity,
  });
}

/**
 * A React hook that prefetches an infinite list of card data for a given deck.
 * @param deckId The ID of the deck to fetch cards from.
 * @param [limit=10] The number of cards to limit the results to. Defaults to 10.
 * @returns A function that can be called to prefetch the first page of cards.
 */
export function usePrefetchInfiniteCards(deckId: number, limit = LIMIT) {
  const queryClient = useQueryClient();

  return () =>
    queryClient.prefetchInfiniteQuery({
      queryKey: getCardsQueryKey({ deckId, tagId: null, search: '', limit }),
      queryFn: ({ signal }) => fetchCards({ signal, deckId, limit }),
    });
}
