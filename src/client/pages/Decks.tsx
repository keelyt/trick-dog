import { useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import Deck from '../components/deck/Deck';
import AddDeckForm from '../components/form/AddDeckForm';
import Modal from '../components/ui/Modal';

import styles from './Decks.module.scss';

import type { DeckData, ServerError } from '../types';

type DeckResponse = DeckData[] | ServerError;

export default function Decks() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const btnAddRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Prevent scrolling on the page when the modal is open.
    if (modalIsOpen) document.body.style.overflow = 'hidden';
    // When the modal closes, allow scrolling and set focus to the new deck button.
    else document.body.style.overflow = 'unset';
  }, [modalIsOpen]);

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

  return (
    <div className={styles.container}>
      {modalIsOpen && (
        <Modal
          onClose={() => {
            setModalIsOpen(false);
            btnAddRef.current?.focus();
          }}
        >
          <AddDeckForm onCancel={() => setModalIsOpen(false)} />
          {/* <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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
          </form> */}
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
