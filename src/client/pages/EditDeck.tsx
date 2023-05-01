import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate, useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import CardView from '../components/card/CardView';
import BackButton from '../components/ui/BackButton';
import Button from '../components/ui/Button';
import DeleteDialog from '../components/ui/DeleteDialog';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Modal from '../components/ui/Modal';
import fetchWithError from '../helpers/fetchWithError';
import useCardsInfiniteQuery from '../helpers/useCardsInfiniteQuery';
import useDeleteDeck from '../helpers/useDeleteDeck';

import styles from './EditDeck.module.scss';

import type { DeckData, DeckResponse } from '../../types';

// TODO: Because user could have a lot of cards in one deck,
// should add pagination, caching (react query), search functionality
// filter functionality (filter by tag), and sort functionality

// TODO: For now, will only give ability to sort newest to oldest.
// If want to add ability to sort oldest to newest, will need to modify query.

// TODO: Adjust styling to use partially persistent nav instead of fixed-size content window.

export default function EditDeck(): JSX.Element {
  // Get the deckId from the URL.
  const { id } = useParams();
  const deckId: number = parseInt(id!);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { ref, inView } = useInView();
  const cardsQuery = useCardsInfiniteQuery(deckId);
  const deleteDeck = useDeleteDeck();
  const navigate = useNavigate();

  const deckQuery = useQuery({
    queryKey: ['decks', deckId] as const,
    queryFn: async ({ signal }): Promise<DeckData> => {
      const result = await fetchWithError<DeckResponse>(`/api/decks/${deckId}`, { signal });
      return result.deck;
    },
  });

  // Fetch the next page if the last card is in view.
  // TODO: After styling, update this to fetch a little earlier.
  /*
   * In mapping the pages, change which card has the ref --
   * e.g. to fetch the next page when the 5th-from-bottom element is in view,
   * change if (i === page.length - 1) to if (i === page.length - 5)
   */
  useEffect(() => {
    if (inView && cardsQuery.hasNextPage) void cardsQuery.fetchNextPage();
  }, [inView, cardsQuery.fetchNextPage, cardsQuery.hasNextPage]);

  const handleDialogCancel = () => setModalIsOpen(false);
  const handleDialogOk = () => {
    // Delete the current deck.
    deleteDeck.mutate(deckId, {
      onSuccess: () => {
        // Navigate back to the decks page.
        navigate('/decks');
      },
    });
  };

  return (
    <div className={styles.container}>
      {modalIsOpen && (
        <Modal onClose={handleDialogCancel}>
          <DeleteDialog
            onOk={handleDialogOk}
            onCancel={handleDialogCancel}
            title='Are you sure?'
            text='Are you sure you want to delete this deck? This cannot be undone.'
          />
        </Modal>
      )}
      <main role='main' className={styles.content}>
        <div className={styles.top}>
          <div>
            <BackButton href='/decks' label='Back to all decks' />
          </div>
          <div>
            <h1>{deckQuery.isSuccess ? `${deckQuery.data.deck_name}` : 'Deck'}</h1>
            <Button type='button' onClick={() => setModalIsOpen(true)}>
              Delete
            </Button>
          </div>
        </div>
        <div className={styles['list-container']}>
          {cardsQuery.isError && cardsQuery.error instanceof Error && (
            <span>{cardsQuery.error.message}</span>
          )}
          {cardsQuery.isLoading ? (
            <p>Loading...</p>
          ) : (
            <ul className={styles.list}>
              {cardsQuery.data?.pages.map((page) =>
                page.map((card, i) => (
                  <CardView
                    key={card.id}
                    ref={i === page.length - 1 ? ref : undefined}
                    question={card.question}
                  />
                ))
              )}
            </ul>
          )}
          {cardsQuery.isFetchingNextPage ? <LoadingSpinner /> : null}
        </div>
      </main>
    </div>
  );
}
