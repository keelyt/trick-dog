import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import Deck from '../components/deck/Deck';
import Modal from '../components/ui/Modal';

import styles from './Decks.module.scss';

import type { SubmitHandler } from 'react-hook-form';

export interface DeckData {
  id: number;
  deck_name: string;
  card_count: number;
}

export interface ServerError {
  error: string;
}

export type DeckResponse = DeckData[] | ServerError;

interface FormData {
  name: string;
}

export default function Decks() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const btnAddRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Prevent scrolling on the page when the modal is open.
    if (modalIsOpen) document.body.style.overflow = 'hidden';
    // When the modal closes, allow scrolling and set focus to the new deck button.
    else document.body.style.overflow = 'unset';
  }, [modalIsOpen]);

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
    onSettled: () => {
      // Always refetch after error or success
      // Using void to explicitly mark floating promise as intentionally not awaited.
      void queryClient.invalidateQueries(['decks'], { exact: true });
    },
  });

  const decksQuery = useQuery({
    queryKey: ['decks'] as const,
    queryFn: async ({ signal }): Promise<DeckData[]> => {
      const response: Response = await fetch('/api/decks', { signal });
      if (response.status !== 200)
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      const result: DeckResponse = (await response.json()) as DeckResponse;
      if ((result as ServerError).error) throw new Error((result as ServerError).error);
      return result as DeckData[];
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data: FormData) =>
    addDeck.mutate(data.name, { onSuccess: () => reset() });

  return (
    <div className={styles.container}>
      {modalIsOpen && (
        <Modal
          onClose={() => {
            setModalIsOpen(false);
            reset();
            btnAddRef.current?.focus();
          }}
        >
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor='name'>Enter a name for your new deck:</label>
            <input id='name' {...register('name', { required: true })} />
            {errors.name && errors.name.type === 'required' && (
              <span className={styles.error}>Deck name is required</span>
            )}
            <button type='button' onClick={() => setModalIsOpen(false)}>
              Cancel
            </button>
            <button type='submit' disabled={addDeck.isLoading}>
              {addDeck.isLoading ? 'Adding Deck...' : 'Add Deck'}
            </button>
          </form>
        </Modal>
      )}
      <button ref={btnAddRef} onClick={() => setModalIsOpen(true)}>
        New Deck
      </button>
      <div className={styles.decks}>
        {decksQuery.isLoading
          ? null
          : decksQuery.data?.map((deck: DeckData) => (
              <Deck
                key={deck.id}
                id={deck.id}
                deckName={deck.deck_name}
                cardCount={deck.card_count}
              />
            ))}
      </div>
    </div>
  );
}
