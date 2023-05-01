import { useInfiniteQuery } from '@tanstack/react-query';

import fetchWithError from './fetchWithError';

import type { CardData } from '../../types';

interface FetchCardsParams {
  signal?: AbortSignal;
  deckId?: number;
  tagId?: number | null;
  before?: string;
}

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
  tagId = null,
  before = '',
}: FetchCardsParams): Promise<CardData[]> => {
  if (!deckId) return [];
  const query = [];
  if (tagId) query.push(`tag=${encodeURIComponent(tagId)}`);
  if (before) query.push(`before=${encodeURIComponent(before)}`);
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
 * @returns The result of the query.
 */
export default function useInfiniteCardsData(deckId: number | undefined, tagId: number | null) {
  return useInfiniteQuery<CardData[]>({
    queryKey: ['decks', deckId, 'cards', { tagId }] as const,
    queryFn: async ({ signal, pageParam = '' }: { signal?: AbortSignal; pageParam?: string }) =>
      await fetchCards({ signal, deckId, tagId, before: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return;
      // Get the timestamp from the oldest card we have.
      return lastPage[lastPage.length - 1].date_created;
    },
    staleTime: Infinity,
  });
}
