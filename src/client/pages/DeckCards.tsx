import { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import CardsList from '../components/card/CardsList';
import SearchForm from '../components/form/SearchForm';
import TagSelect from '../components/tag/TagSelect';
import Button from '../components/ui/Button';
import useEscapeKey from '../helpers/useEscapeKey';
import useMediaMatch from '../helpers/useMediaMatch';
import useOutsideClick from '../helpers/useOutsideClick';
import { useDeckContext } from '../layouts/EditDeckLayout';

import styles from './DeckCards.module.scss';

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

export default function DeckCards(): JSX.Element {
  const { deckId, deckTags } = useDeckContext();
  const location: Location = useLocation();

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

  // This is used to adjust the label visibility and placeholder text of the filters
  // based on window size. The media query must match the width at which the the filter
  // options are hidden and the "Filters" button is shown.
  const mediaMatch = useMediaMatch('(max-width: 992px)');

  const filtersRef = useRef<HTMLDivElement>(null);
  const filtersToggleRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const toggleFilters = () => setShowFilters((prevShowFilters) => !prevShowFilters);
  const hideFilters = () => {
    if (showFilters) {
      setShowFilters(false);
      filtersToggleRef.current?.focus();
    }
  };
  useEscapeKey(() => {
    // If user focus is in search input element and search is not empty, allow ESC to clear input.
    if (searchValue && searchInputRef.current === document.activeElement) return;
    hideFilters();
  });
  useOutsideClick(hideFilters, filtersRef);

  const handleTagChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newSelection = event.target.value;
    if (!newSelection) setTag(null);
    else setTag(Number(newSelection));
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
    <>
      <div className={styles['card-options']}>
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
              ref={filtersToggleRef}
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
                ref={searchInputRef}
              />
            </div>
            <div className={styles.filters__select}>
              <TagSelect
                tags={deckTags}
                onChange={handleTagChange}
                value={tag ?? ''}
                defaultText={tag ? 'All tags' : mediaMatch ? 'Select...' : 'Select a tag to filter'}
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
      <CardsList deckId={deckId} tagId={tag} search={search} />
    </>
  );
}
