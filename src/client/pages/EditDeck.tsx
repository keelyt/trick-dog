import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CardsList from '../components/card/CardsList';
import SearchForm from '../components/form/SearchForm';
import TagSelect from '../components/tag/TagSelect';
import BackButton from '../components/ui/BackButton';
import Button from '../components/ui/Button';
import DeleteDialog from '../components/ui/DeleteDialog';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import Modal from '../components/ui/Modal';
import QueryError from '../components/ui/QueryError';
import useDeckData from '../helpers/useDeckData';
import useDeleteDeck from '../helpers/useDeleteDeck';

import styles from './EditDeck.module.scss';

import type { ChangeEvent } from 'react';

// TODO: Because user could have a lot of cards in one deck,
// should add pagination, caching (react query), search functionality
// filter functionality (filter by tag), and sort functionality

// TODO: For now, will only give ability to sort newest to oldest.
// If want to add ability to sort oldest to newest, will need to modify query.

// TODO: Adjust styling to use partially persistent nav instead of fixed-size content window.

// TODO: Add ability to select and delete multiple cards at once.

export default function EditDeck(): JSX.Element {
  // Get the deckId from the URL.
  const { deckId: id } = useParams();

  const deckId: number = parseInt(id!);

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [tag, setTag] = useState<number | null>(null);
  const [search, setSearch] = useState<string>('');

  const deleteDeck = useDeleteDeck();
  const deckQuery = useDeckData(deckId);

  const navigate = useNavigate();

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

  const handleTagChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newSelection = event.target.value;
    if (!newSelection) setTag(null);
    setTag(parseInt(newSelection));
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length === 0) setSearch('');
  };

  const handleSearchSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearch((event.target.search as HTMLInputElement).value);
  };

  return (
    <div className={styles.container}>
      {modalIsOpen && deckQuery.isSuccess && (
        <Modal onClose={handleDialogCancel}>
          <DeleteDialog
            onOk={handleDialogOk}
            onCancel={handleDialogCancel}
            title='Are you sure?'
            text='Are you sure you want to delete this deck? This cannot be undone.'
            okLabel={deleteDeck.isLoading ? 'Deleting...' : 'Delete'}
            okDisabled={deleteDeck.isLoading}
          />
        </Modal>
      )}
      <main role='main' className={styles.content}>
        {deckQuery.isLoading && <LoadingIndicator />}
        {deckQuery.isError && (
          <QueryError
            label={
              deckQuery.error instanceof Error
                ? deckQuery.error.message
                : 'Error retrieving information from server.'
            }
            refetchFn={() => deckQuery.refetch()}
          />
        )}
        {deckQuery.isSuccess && (
          <>
            <div className={styles.top}>
              <div>
                <BackButton href='/decks' label='Back to all decks' />
              </div>
              <div>
                <h1 className={styles.top__heading}>{deckQuery.data.deckName}</h1>
                <TagSelect tags={deckQuery.data.tags} onChange={handleTagChange} />
                <Button type='button' onClick={() => setModalIsOpen(true)}>
                  Delete
                </Button>
                <SearchForm
                  onChange={handleSearchChange}
                  onSubmit={handleSearchSubmit}
                  maxLength={50}
                  placeholder='Search cards by text'
                  label='Search cards by text'
                />
              </div>
            </div>
            <CardsList deckId={deckId} tagId={tag} search={search} />
          </>
        )}
      </main>
    </div>
  );
}
