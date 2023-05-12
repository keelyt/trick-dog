import { useMutation, useQueryClient } from '@tanstack/react-query';

import fetchWithError from './fetchWithError';
import { getCardsQueryKey } from './useInfiniteCardsData';

import type { CardResponse, InfiniteCardData } from '../../types';

interface UpdateCardParams {
  cardId: number;
  deckId: number;
  question?: string;
  answer?: string;
  tags?: number[];
}

/**
 * A React hook that provides a mutation function for updating a card.
 * @param tagId The tagId for the tag filter from the Edit Deck page if the user navigated from there.
 * Should be null if the user navigated directly to the Edit Card page.
 * @param search The search string filter from the Edit Deck page if the user navigated from there.
 * Should be empty string if the user navigated directly to the Edit Card page.
 * @returns A mutation function for deleting a deck.
 */
export default function useUpdateCard(tagId: number | null, search: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cardId, deckId, question, answer, tags }: UpdateCardParams) =>
      fetchWithError<CardResponse>(`/api/decks/${deckId}/cards/${cardId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...(question !== undefined && { question }),
          ...(answer !== undefined && { answer }),
          ...(tags && { tags }),
        }),
      }),
    onMutate: async ({ deckId, cardId, question, answer, tags }: UpdateCardParams) => {
      // Cancel outgoing refetches (so they don't overwrite our optimistic update).
      await queryClient.cancelQueries(['decks', deckId]);
      // Get the query key based on the deckId, tagId, and search.
      const queryKey = getCardsQueryKey({ deckId, tagId, search });
      // Snapshot the previous cards.
      const previousCards = queryClient.getQueryData<InfiniteCardData>(queryKey);
      // Optimistically update the cards data.
      if (tags && tagId && !tags.includes(tagId)) {
        // If the tags were modified so that the current card would no longer be included
        // in the tag filter, optimistically update by removing the card from the query result.
        queryClient.setQueryData<InfiniteCardData>(queryKey, (old) => ({
          ...old,
          pages: old?.pages?.map((page) => page.filter((card) => card.id !== cardId)),
        }));
      } else {
        // Otherwise, update the card with the new question/answer.
        queryClient.setQueryData<InfiniteCardData>(queryKey, (old) => ({
          ...old,
          pages: old?.pages?.map((page) =>
            page.map((card) =>
              card.id === cardId
                ? {
                    ...card,
                    ...(question !== undefined && { question }),
                    ...(answer !== undefined && { answer }),
                  }
                : card
            )
          ),
        }));
      }
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
