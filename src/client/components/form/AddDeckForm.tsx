import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import styles from './AddDeckForm.module.scss';

import type { DeckData } from '../../types';
import type { SubmitHandler } from 'react-hook-form';

interface FormData {
  name: string;
}

export default function AddDeckForm({ onCancel }: { onCancel: () => void }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    return () => reset();
  }, []);

  const addDeck = useMutation({
    mutationFn: async (deckName: string) => {
      return fetch('/api/decks', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ deck_name: deckName }),
      }).then((res) => res.json());
    },
    onMutate: async (deckName: string) => {
      // Cancel outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(['decks']);
      // Snapshot the previous value.
      const previousDecks = queryClient.getQueryData(['decks']);
      // Optimistically update with the new deck, using a random number for the ID.
      queryClient.setQueryData(['decks'], (old: DeckData[] | undefined) => {
        const newDeck: DeckData = {
          id: Math.random(),
          deck_name: deckName,
          card_count: 0,
        };
        return [...(old ?? []), newDeck];
      });
      // Return a rollback function.
      return () => queryClient.setQueryData(['decks'], previousDecks);
    },
    onError: (data, variables, rollback) => {
      // If the mutation fails, roll back.
      if (rollback) rollback();
    },
    onSuccess: (data: DeckData) => {
      reset();
      navigate(`/decks/${data.id}`);
    },
    onSettled: () => {
      // Always refetch after error or success
      // Using void to explicitly mark floating promise as intentionally not awaited.
      void queryClient.invalidateQueries(['decks'], { exact: true });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data: FormData) => addDeck.mutate(data.name);

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor='name'>Enter a name for your new deck:</label>
      <input id='name' {...register('name', { required: true })} />
      {errors.name && errors.name.type === 'required' && (
        <span className={styles.form__error}>*Deck name is required</span>
      )}
      <button type='button' onClick={onCancel}>
        Cancel
      </button>
      <button type='submit' disabled={addDeck.isLoading}>
        {addDeck.isLoading ? 'Adding Deck...' : 'Add Deck'}
      </button>
    </form>
  );
}
