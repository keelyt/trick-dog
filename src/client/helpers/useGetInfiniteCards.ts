import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

import fetchWithError from './fetchWithError';

import type { CardData, CardsResponse } from '../../types';

// Hardcoded page limit of 12 cards per page.
const LIMIT = 12;

interface QueryKeyParams {
  deckId: number;
  tagId: number | null;
  search: string;
  limit?: number;
}

interface FetchParams {
  signal?: AbortSignal;
  deckId: number;
  tagId?: number | null;
  search?: string;
  before?: number | null;
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
@param [params.limit=12] The number of cards to limit the results to. Defaults to 12.
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
 * @param [params.before=''] The id to fetch cards before. Defaults to empty string.
 * @param [params.limit = 12] The number of cards to limit the results to. Defaults to 12.
 * @returns The card data for the requested page.
 */
export const fetchCards = async ({
  signal,
  deckId,
  tagId = null,
  search = '',
  before = null,
  limit = LIMIT,
}: FetchParams): Promise<CardData[]> => {
  const query = [`limit=${encodeURIComponent(limit)}`];
  if (tagId) query.push(`tag=${encodeURIComponent(tagId)}`);
  if (search) query.push(`q=${encodeURIComponent(search)}`);
  if (before) query.push(`before=${encodeURIComponent(before)}`);
  const deckIdParam = encodeURIComponent(deckId);

  const response = await fetchWithError<CardsResponse>(
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
 * @param [params.limit=12] The number of cards to limit the results to. Defaults to 12.
 * @returns The result of the query.
 */
export function useGetInfiniteCards({
  deckId,
  tagId,
  search = '',
  limit = LIMIT,
}: InfiniteQueryParams) {
  const queryClient = useQueryClient();
  return useInfiniteQuery({
    queryKey: getCardsQueryKey({ deckId, tagId, search, limit }),
    queryFn: async ({
      signal,
      pageParam = null,
    }: {
      signal?: AbortSignal;
      pageParam?: number | null;
    }) => {
      const cards = await fetchCards({ signal, deckId, tagId, search, before: pageParam, limit });

      // Add each individual card to the cache.
      cards.forEach((card) => queryClient.setQueryData(['decks', deckId, 'cards', card.id], card));

      return cards;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return;
      // Get the id from the oldest card we have.
      return lastPage[lastPage.length - 1].id;
    },
    staleTime: Infinity,
  });
}

/**
 * A React hook that prefetches an infinite list of card data for a given deck.
 * @param deckId The ID of the deck to fetch cards from.
 * @param [limit=12] The number of cards to limit the results to. Defaults to 12.
 * @returns A function that can be called to prefetch the first page of cards.
 */
export function usePrefetchInfiniteCards(deckId: number, limit = LIMIT) {
  const queryClient = useQueryClient();

  return () =>
    queryClient.prefetchInfiniteQuery({
      queryKey: getCardsQueryKey({ deckId, tagId: null, search: '', limit }),
      queryFn: () => fetchCards({ deckId, limit }),
    });
}
