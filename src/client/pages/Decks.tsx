import { useEffect, useRef, useState } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import AddDeckForm from '../components/deck/AddDeckForm';
import Deck from '../components/deck/Deck';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import fetchWithError from '../helpers/fetchWithError';

import styles from './Decks.module.scss';

import type { DeckData, DecksResponse } from '../../types';

export default function Decks() {
  const queryClient = useQueryClient();
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
      const result = await fetchWithError<DecksResponse>('/api/decks', { signal });

      // Add each deck to the cache.
      result.decks.forEach((deck) => queryClient.setQueryData(['decks', deck.id], deck));

      return result.decks;
    },
  });

  const handleFormClose = () => {
    setModalIsOpen(false);
    btnAddRef.current?.focus();
  };

  return (
    <div className={styles.container}>
      {modalIsOpen && (
        <Modal onClose={handleFormClose}>
          <AddDeckForm onCancel={handleFormClose} />
        </Modal>
      )}
      <main role='main' className={styles.content}>
        <div className={styles.top}>
          <h1>Decks</h1>
          <Button ref={btnAddRef} type='button' onClick={() => setModalIsOpen(true)}>
            New Deck
          </Button>
        </div>
        <ul className={styles.decks}>
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
        </ul>
      </main>
    </div>
  );
}
