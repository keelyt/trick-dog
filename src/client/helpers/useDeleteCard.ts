import { useMutation, useQueryClient } from '@tanstack/react-query';

import fetchWithError from './fetchWithError';
import { getCardsQueryKey } from './useInfiniteCardsData';

import type { CardResponse, InfiniteCardData } from '../../types';

interface DeleteCardParams {
  deckId: number;
  cardId: number;
  tagId: number | null;
  search: string;
}

/**
 * A React hook that provides a mutation function for deleting a card.
 * @returns A mutation function for deleting a card.
 */
export default function useDeleteCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ deckId, cardId }: DeleteCardParams) =>
      fetchWithError<CardResponse>(`/api/decks/${deckId}/cards/${cardId}`, { method: 'DELETE' }),
    onMutate: async ({ deckId, cardId, tagId, search }: DeleteCardParams) => {
      // Cancel outgoing refetches (so they don't overwrite our optimistic update).
      await queryClient.cancelQueries(['decks', deckId]);
      // Get the query key based on the deckId, tagId, and search.
      const queryKey = getCardsQueryKey({ deckId, tagId, search });
      // Snapshot the previous cards.
      const previousCards = queryClient.getQueryData<InfiniteCardData>(queryKey);
      // Optimistically update the cards data by removing the card.
      queryClient.setQueryData<InfiniteCardData>(queryKey, (old) => ({
        ...old,
        pages: old?.pages?.map((page) => page.filter((card) => card.id !== cardId)),
      }));
      // Return a rollback function.
      return () => queryClient.setQueryData<InfiniteCardData>(queryKey, previousCards);
    },
    onError: (data, variables, rollback) => {
      // If the mutation fails, roll back the optimistic updates.
      if (rollback) rollback();
    },
    onSettled: (data, error, variables) => {
      // After either error or success, invalidate the decks query cache to trigger a refetch.
      // Using void to explicitly mark floating promise as intentionally not awaited.
      void queryClient.invalidateQueries(['decks', variables.deckId]);
      void queryClient.invalidateQueries(['decks'], { exact: true });
    },
  });
}
