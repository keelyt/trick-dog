import { useInfiniteQuery } from '@tanstack/react-query';

import fetchWithError from './fetchWithError';

import type { CardData } from '../../types';

// Hardcoded page limit of 10 cards per page.
const LIMIT = 10;

interface FetchCardsParams {
  signal?: AbortSignal;
  deckId?: number;
  tagId?: number | null;
  search?: string;
  before?: string;
  LIMIT?: number;
}

/**
 * Fetches a page of cards for a given deck.
 * @param params The parameters for the fetch.
 * @param [params.signal] The abort signal for the request.
 * @param params.deckId The ID of the deck to fetch cards from.
 * @param [params.tagId=null] The ID of the tag to filter cards by.
 * @param [params.search=''] The search query to filter cards by.
 * @param [params.before=''] The date to fetch cards before (default is empty string).
 * @param [params.LIMIT] The number of cards to limit the results to.
 * @returns The card data for the requested page.
 */
export const fetchCards = async ({
  signal,
  deckId,
  tagId = null,
  search = '',
  before = '',
  LIMIT,
}: FetchCardsParams): Promise<CardData[]> => {
  if (!deckId) return [];

  const query = [];
  if (tagId) query.push(`tag=${encodeURIComponent(tagId)}`);
  if (search) query.push(`q=${encodeURIComponent(search)}`);
  if (before) query.push(`before=${encodeURIComponent(before)}`);
  if (LIMIT) query.push(`limit=${encodeURIComponent(LIMIT)}`);
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
 * @param deckId The ID of the deck to fetch cards from.
 * @param tagId The ID of the tag to filter cards by.
 * @param [search=''] - The search query to filter cards by.
 * @returns The result of the query.
 */
export default function useInfiniteCardsData(
  deckId: number | undefined,
  tagId: number | null,
  search = ''
) {
  return useInfiniteQuery<CardData[]>({
    queryKey: ['decks', deckId, 'cards', { tagId, search, LIMIT }] as const,
    queryFn: async ({ signal, pageParam = '' }: { signal?: AbortSignal; pageParam?: string }) =>
      await fetchCards({ signal, deckId, tagId, search, before: pageParam, LIMIT }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < LIMIT) return;
      // Get the timestamp from the oldest card we have.
      return lastPage[lastPage.length - 1].date_created;
    },
    staleTime: Infinity,
  });
}
