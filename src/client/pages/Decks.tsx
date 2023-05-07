import { useEffect, useRef, useState } from 'react';

import AddDeckForm from '../components/deck/AddDeckForm';
import Deck from '../components/deck/Deck';
import Button from '../components/ui/Button';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import Modal from '../components/ui/Modal';
import QueryError from '../components/ui/QueryError';
import useDecksData from '../helpers/useDecksData';

import styles from './Decks.module.scss';

import type { DeckData } from '../../types';

export default function Decks(): JSX.Element {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const btnAddRef = useRef<HTMLButtonElement>(null);
  const decksQuery = useDecksData();

  useEffect(() => {
    // Prevent scrolling on the page when the modal is open.
    if (modalIsOpen) document.body.style.overflow = 'hidden';
    // When the modal closes, allow scrolling and set focus to the new deck button.
    else document.body.style.overflow = 'unset';
  }, [modalIsOpen]);

  const handleFormClose = () => {
    setModalIsOpen(false);
    btnAddRef.current?.focus();
  };

  return (
    <div className={styles.container}>
      {modalIsOpen && decksQuery.isSuccess && (
        <Modal onClose={handleFormClose}>
          <AddDeckForm onCancel={handleFormClose} />
        </Modal>
      )}
      <main role='main' className={styles.content}>
        {decksQuery.isError ? (
          <QueryError
            label={
              decksQuery.error instanceof Error
                ? decksQuery.error.message
                : 'Error retrieving information from server.'
            }
            refetchFn={() => decksQuery.refetch()}
          />
        ) : (
          <>
            <div className={styles.top}>
              <h1>Decks</h1>
              <Button
                ref={btnAddRef}
                as='button'
                type='button'
                onClick={() => setModalIsOpen(true)}
              >
                New Deck
              </Button>
            </div>
            {decksQuery.isLoading ? (
              <div className={styles.decks}>
                <LoadingIndicator />
              </div>
            ) : (
              <ul className={styles.decks}>
                {decksQuery.data.map((deck: DeckData) => (
                  <Deck
                    key={deck.id}
                    deckId={deck.id}
                    deckName={deck.deckName}
                    cardCount={deck.cardCount}
                  />
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  );
}
