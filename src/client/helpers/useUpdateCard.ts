import { useMutation, useQueryClient } from '@tanstack/react-query';

import useFetchWithAuth from './useFetchWithAuth';
import { getCardsQueryKey } from './useGetInfiniteCards';

import type {
  CardData,
  CardResponse,
  CardsFilterState,
  InfiniteCardData,
  UpdateCardParams,
} from '../../types';

/**
 * A React hook that provides a mutation function for updating a card.
 * @param tagId The tagId for the tag filter from the Edit Deck page if the user navigated from there.
 * Should be null if the user navigated directly to the Edit Card page.
 * @param search The search string filter from the Edit Deck page if the user navigated from there.
 * Should be empty string if the user navigated directly to the Edit Card page.
 * @returns A mutation function for updating a card.
 */
export default function useUpdateCard({ tagId, search }: CardsFilterState) {
  const queryClient = useQueryClient();
  const fetchWithAuth = useFetchWithAuth();

  return useMutation({
    mutationFn: async ({ cardId, deckId, question, answer, tags }: UpdateCardParams) =>
      fetchWithAuth<CardResponse>(`/api/decks/${deckId}/cards/${cardId}`, {
        method: 'PATCH',
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
      const cardQueryKey = ['decks', variables.deckId, 'cards', variables.cardId];
      const tagsQueryKey = ['decks', variables.deckId, 'cards', variables.cardId, 'tags'];
      const cardsQueryKey = getCardsQueryKey({ deckId: variables.deckId, tagId, search });
      // Update the data in the cache.
      queryClient.setQueryData<CardData>(cardQueryKey, data.card);
      if (variables.tags) queryClient.setQueryData<number[]>(tagsQueryKey, variables.tags);
      if (
        (tagId && variables.tags && !variables.tags.includes(tagId)) ||
        (search &&
          !variables.question.toLowerCase().includes(search.toLowerCase()) &&
          !variables.answer.toLowerCase().includes(search.toLowerCase()))
      ) {
        // If the tags were modified so that the current card would no longer be included in the
        // tag filter or if the question/answer were modified so that the card would no longer
        // be included in the search, update by removing the card from the page.
        queryClient.setQueryData<InfiniteCardData>(cardsQueryKey, (old) => {
          if (old)
            return {
              ...old,
              pages: old.pages?.map((page) => page.filter((card) => card.id !== variables.cardId)),
            };
        });
      } else {
        // Otherwise, update the card with the new question/answer.
        queryClient.setQueryData<InfiniteCardData>(cardsQueryKey, (old) => {
          if (old)
            return {
              ...old,
              pages: old.pages?.map((page) =>
                page.map((card) =>
                  card.id === variables.cardId
                    ? {
                        ...card,
                        question: variables.question,
                        answer: variables.answer,
                      }
                    : card
                )
              ),
            };
        });
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
