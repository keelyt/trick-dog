import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import fetchWithError from '../../helpers/fetchWithError';
import TextInput from '../form/TextInput';
import Button from '../ui/Button';

import styles from './AddDeckForm.module.scss';

import type { DeckData, DeckResponse } from '../../../types';
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
    mutationFn: async (deckName: string) =>
      fetchWithError<DeckResponse>('/api/decks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deck_name: deckName }),
      }),
    onMutate: async (deckName: string) => {
      // Cancel outgoing refetches (so they don't overwrite our optimistic update).
      await queryClient.cancelQueries(['decks']);
      // Snapshot the previous value.
      const previousDecks = queryClient.getQueryData(['decks']);
      // Create optimistic deck, using a random number for the ID.
      const optimisticDeck: DeckData = { id: Math.random(), deck_name: deckName, card_count: 0 };
      // Optimistically update the deck data with the new deck.
      queryClient.setQueryData(['decks'], (old: DeckData[] | undefined) => [
        ...(old ?? []),
        optimisticDeck,
      ]);
      // Return context with the optimistic deck.
      return { optimisticDeck, previousDecks };
    },
    onError: (data, variables, context) => {
      // If the mutation fails, roll back the optimistic updates.
      queryClient.setQueryData(['decks'], context?.previousDecks);
    },
    onSuccess: (data: DeckResponse, variables, context) => {
      // Reset the form.
      reset();
      // Replace optimistic deck with actual deck.
      queryClient.setQueryData(['decks'], (old: DeckData[] | undefined) =>
        old?.map((deck) => (deck.id === context?.optimisticDeck.id ? data.deck : deck))
      );
      queryClient.setQueryData(['decks', data.deck.id], data.deck);
      // Navigate to the new deck page.
      navigate(`/decks/${data.deck.id}`);
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
