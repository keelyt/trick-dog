import { useMutation, useQueryClient } from '@tanstack/react-query';

import fetchWithError from './fetchWithError';
import { getCardsQueryKey } from './useGetInfiniteCards';

import type {
  AddCardParams,
  CardData,
  CardResponse,
  CardsFilterState,
  InfiniteCardData,
} from '../../types';

/**
 * A React hook that provides a mutation function for adding a new card.
 * @param tagId The tagId for the tag filter from the Edit Deck page if the user navigated from there.
 * Should be null if the user navigated directly to the Edit Card page.
 * @param search The search string filter from the Edit Deck page if the user navigated from there.
 * Should be empty string if the user navigated directly to the Edit Card page.
 * @returns A mutation function for adding a card.
 */
export default function useAddCard({ tagId, search }: CardsFilterState) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ deckId, question, answer, tags }: AddCardParams) =>
      fetchWithError<CardResponse>(`/api/decks/${deckId}/cards/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          answer,
          ...(tags && { tags }),
        }),
      }),
    onSuccess: (data: CardResponse, variables) => {
      // Get the query keys.
      const cardQueryKey = ['decks', variables.deckId, 'cards', data.card.id];
      const tagsQueryKey = ['decks', variables.deckId, 'cards', data.card.id, 'tags'];
      const cardsQueryKey = getCardsQueryKey({ deckId: variables.deckId, tagId, search });
      // Update the data in the cache.
      queryClient.setQueryData<CardData>(cardQueryKey, data.card);
      if (variables.tags) queryClient.setQueryData<number[]>(tagsQueryKey, variables.tags);
      if (
        (!tagId && !search) ||
        (tagId && variables.tags && variables.tags.includes(tagId)) ||
        (search &&
          (variables.question.toLowerCase().includes(search.toLowerCase()) ||
            variables.answer.toLowerCase().includes(search.toLowerCase())))
      ) {
        // If the new card would be included in the current filter, add it to the page.
        // Since the page is sorted newest to oldest, add it to the front of the list.
        queryClient.setQueryData<InfiniteCardData>(cardsQueryKey, (old) => ({
          ...old,
          pages: [
            [data.card, ...(old?.pages?.[0] ?? [])], // Add the new card at the beginning
            ...(old?.pages?.slice(1) ?? []), // Copy the remaining pages
          ],
        }));
      }
    },
    onSettled: (data, error, variables) => {
      // After either error or success, invalidate the decks query cache to trigger a refetch.
      // Using void to explicitly mark floating promise as intentionally not awaited.
      void queryClient.invalidateQueries(['decks', variables.deckId]);
      void queryClient.invalidateQueries(['decks'], { exact: true });
    },
  });
}
