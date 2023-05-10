import { useEffect, useRef, useState } from 'react';
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
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [mediaMatch, setMediaMatch] = useState<boolean>(false);

  const deleteDeck = useDeleteDeck();
  const deckQuery = useDeckData(deckId);

  const navigate = useNavigate();
  const btnDeleteRef = useRef<HTMLButtonElement>(null);

  // This is used to adjust the label visibility and placeholder text of the filters
  // based on window size.
  useEffect(() => {
    // The media query must match the width at which the the filter options are hidden
    // and the "Filters" button is shown.
    const mediaQueryList = window.matchMedia('(max-width: 992px)');
    const mediaChange = () => setMediaMatch(mediaQueryList.matches);
    // Call the handler when the component mounts to set the initial showLabels state.
    mediaChange();
    // Add an event listener for media query status changes.
    mediaQueryList.addEventListener('change', mediaChange);
    // Cleanup function to remove the event listener when the component unmounts.
    return () => mediaQueryList.removeEventListener('change', mediaChange);
  }, []);

  const handleDialogCancel = () => {
    setModalIsOpen(false);
    btnDeleteRef.current?.focus();
  };

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

  const toggleFilters = () => setShowFilters((prevShowFilters) => !prevShowFilters);

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
              <div className={`${styles.top__row} ${styles['top__row--upper']}`}>
                <h1 className={styles.top__heading}>{deckQuery.data.deckName}</h1>
                <BackButton href='/decks' label='Back to all decks' />
              </div>
              <div className={`${styles.top__row} ${styles['top__row--lower']}`}>
                <Button
                  ref={btnDeleteRef}
                  as='button'
                  type='button'
                  onClick={() => setModalIsOpen(true)}
                  size='md'
                  rounded={true}
                >
                  Delete Deck
                </Button>
                <div className={styles.cardOptions}>
                  <div className={styles.filters}>
                    <div className={styles.filters__toggle}>
                      <Button
                        as='button'
                        type='button'
                        onClick={toggleFilters}
                        aria-label={showFilters ? 'Hide filter options' : 'Show filter options'}
                        aria-expanded={showFilters}
                        aria-controls='card-filters'
                        rounded={true}
                        size='md'
                      >
                        {showFilters ? 'Hide Filters' : 'Filter'}
                      </Button>
                    </div>
                    <div
                      id='card-filters'
                      className={`${styles.filters__container} ${
                        showFilters ? '' : styles['filters__container--collapsed']
                      }`}
                    >
                      <div className={styles.filters__search}>
                        <SearchForm
                          onChange={handleSearchChange}
                          onSubmit={handleSearchSubmit}
                          maxLength={50}
                          placeholder={mediaMatch ? 'Search...' : 'Search cards by text'}
                          label='Search Cards by Text'
                          showLabel={mediaMatch}
                          rounded={true}
                          colorScheme={mediaMatch ? 'dropdown' : 'main'}
                        />
                      </div>
                      <div className={styles.filters__select}>
                        <TagSelect
                          tags={deckQuery.data.tags}
                          onChange={handleTagChange}
                          defaultSelected={!tag}
                          defaultText={
                            tag ? 'All tags' : mediaMatch ? 'Select...' : 'Select a tag to filter'
                          }
                          showLabel={mediaMatch}
                          rounded={true}
                          colorScheme={mediaMatch ? 'dropdown' : 'main'}
                        />
                      </div>
                    </div>
                  </div>
                  <Button as='link' href={`/decks/${deckId}/cards/new`} size='md' rounded={true}>
                    Add Card
                  </Button>
                </div>
              </div>
            </div>
            <CardsList deckId={deckId} tagId={tag} search={search} />
          </>
        )}
      </main>
    </div>
  );
}
