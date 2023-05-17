import { useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

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
import useEscapeKey from '../helpers/useEscapeKey';
import useMediaMatch from '../helpers/useMediaMatch';
import useOutsideClick from '../helpers/useOutsideClick';

import styles from './EditDeck.module.scss';

import type { CardsFilterState } from '../../types';
import type { ChangeEvent } from 'react';
import type { Location } from 'react-router-dom';

// TODO: For now, will only give ability to sort newest to oldest.
// If want to add ability to sort oldest to newest, will need to modify query.

// TODO: Add ability to select and delete multiple cards at once.
// It's too easy to accidentally delete cards; however, it would be tedious for users
// if they had to delete cards one at a time and there was a confirmation dialog each time.
// Add the ability to select and delete multiple and then use a delete confirmation dialog
// (e.g. "Are you sure you want to delete the 10 selected cards?")

export default function EditDeck(): JSX.Element {
  // Get the deckId from the URL.
  const { deckId: id } = useParams();
  const location: Location = useLocation();

  const deckId: number = parseInt(id!);

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [tag, setTag] = useState<number | null>(
    location.state ? (location.state as CardsFilterState).tagId : null
  );
  const [search, setSearch] = useState<string>(
    location.state ? (location.state as CardsFilterState).search : ''
  );
  const [searchValue, setSearchValue] = useState<string>(
    location.state ? (location.state as CardsFilterState).search : ''
  );
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const deleteDeck = useDeleteDeck();
  const deckQuery = useDeckData(deckId);

  // This is used to adjust the label visibility and placeholder text of the filters
  // based on window size. The media query must match the width at which the the filter
  // options are hidden and the "Filters" button is shown.
  const mediaMatch = useMediaMatch('(max-width: 992px)');

  const navigate = useNavigate();

  const btnDeleteRef = useRef<HTMLButtonElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);

  const toggleFilters = () => setShowFilters((prevShowFilters) => !prevShowFilters);
  const hideFilters = () => {
    if (showFilters) setShowFilters(false);
  };
  useEscapeKey(hideFilters);
  useOutsideClick(hideFilters, filtersRef);

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
    else setTag(parseInt(newSelection));
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
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
                  <div className={styles.filters} ref={filtersRef}>
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
                          value={searchValue}
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
                          value={tag ?? ''}
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
