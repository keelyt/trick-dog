import { useMutation } from '@tanstack/react-query';

import useFetchWithAuth from './useFetchWithAuth';

import type { CardsResponse } from '../../types';

interface UpdateCardDifficultyParams {
  deckId: number;
  cardId: number;
  difficulty: string;
}

export default function useUpdateCardDifficulty() {
  const fetchWithAuth = useFetchWithAuth();

  return useMutation({
    mutationFn: ({ deckId, cardId, difficulty }: UpdateCardDifficultyParams) =>
      fetchWithAuth<CardsResponse>(`/api/decks/${deckId}/cards/${cardId}/difficulty`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ difficulty }),
      }),
  });
}
