import { useMutation } from '@tanstack/react-query';

import fetchWithError from './fetchWithError';

import type { CardsResponse } from '../../types';

interface UpdateCardDifficultyParams {
  deckId: number;
  cardId: number;
  difficulty: string;
}

export default function useUpdateCardDifficulty() {
  return useMutation({
    mutationFn: ({ deckId, cardId, difficulty }: UpdateCardDifficultyParams) =>
      fetchWithError<CardsResponse>(`/api/decks/${deckId}/cards/${cardId}/difficulty`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ difficulty }),
      }),
  });
}
