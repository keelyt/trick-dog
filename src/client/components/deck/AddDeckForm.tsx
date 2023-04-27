import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import TextInput from '../form/TextInput';
import Button from '../ui/Button';

import styles from './AddDeckForm.module.scss';

import type { DeckData } from '../../types';
import type { SubmitHandler } from 'react-hook-form';

interface FormValues {
  name: string;
}

export default function AddDeckForm({ onCancel }: { onCancel: () => void }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Reset the form when the component unmounts.
  useEffect(() => {
    return () => reset();
  }, []);

  // Mutation for adding a new deck
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
      // Cancel outgoing refetches (so they don't overwrite our optimistic update).
      await queryClient.cancelQueries(['decks']);
      // Snapshot the previous value.
      const previousDecks = queryClient.getQueryData(['decks']);
      // Optimistically update the deck data with the new deck, using a random number for the ID.
      queryClient.setQueryData(['decks'], (old: DeckData[] | undefined) => {
        const newDeck: DeckData = {
          id: Math.random(),
          deck_name: deckName,
          card_count: 0,
        };
        return [...(old ?? []), newDeck];
      });
      // Return a rollback function to undo the optimistic update in case of a mutation failure.
      return () => queryClient.setQueryData(['decks'], previousDecks);
    },
    onError: (data, variables, rollback) => {
      // If the mutation fails, roll back the optimistic updates.
      if (rollback) rollback();
    },
    onSuccess: (data: DeckData) => {
      // Reset the form and navigate to the new deck page on successful mutation.
      reset();
      navigate(`/decks/${data.id}`);
    },
    onSettled: () => {
      // After either error or success, invalidate the decks query cache to trigger a refetch.
      // Using void to explicitly mark floating promise as intentionally not awaited.
      void queryClient.invalidateQueries(['decks'], { exact: true });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  // Handler function for form submission
  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => addDeck.mutate(data.name);

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h1>Create Deck</h1>
      <TextInput<FormValues>
        register={register}
        name={'name'}
        label='Deck Name'
        errors={errors}
        validation={{ required: true }}
      />
      <div className={styles.buttons}>
        <Button type='button' onClick={onCancel}>
          Cancel
        </Button>
        <Button type='submit' disabled={addDeck.isLoading}>
          {addDeck.isLoading ? 'Creating Deck...' : 'Create Deck'}
        </Button>
      </div>
    </form>
  );
}
