import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import CardsList from '../components/card/CardsList';
import TagSelect from '../components/tag/TagSelect';
import BackButton from '../components/ui/BackButton';
import Button from '../components/ui/Button';
import DeleteDialog from '../components/ui/DeleteDialog';
import Modal from '../components/ui/Modal';
import fetchWithError from '../helpers/fetchWithError';
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

  const deleteDeck = useDeleteDeck();
  const navigate = useNavigate();

  const deckQuery = useQuery({
    queryKey: ['decks', deckId] as const,
    queryFn: async ({ signal }): Promise<DeckData> => {
      const result = await fetchWithError<DeckResponse>(`/api/decks/${deckId}`, { signal });
      return result.deck;
    },
  });

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
            <TagSelect tags={[]} onChange={() => undefined} />
            <Button type='button' onClick={() => setModalIsOpen(true)}>
              Delete
            </Button>
          </div>
        </div>
        <CardsList deckId={deckId} tags={[]} />
      </main>
    </div>
  );
}
