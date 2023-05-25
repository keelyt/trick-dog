import { BsTags } from 'react-icons/bs';
import { IoSettingsOutline } from 'react-icons/io5';
import { TbCards } from 'react-icons/tb';
import { NavLink, Outlet, useMatch, useOutletContext, useParams } from 'react-router-dom';

import BackButton from '../components/ui/BackButton';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import QueryError from '../components/ui/QueryError';
import useDeckData from '../helpers/useDeckData';

import styles from './EditDeckLayout.module.scss';

import type { TagData } from '../../types';

export default function EditDeckLayout(): JSX.Element {
  // Get the deckId from the URL.
  const { deckId: id } = useParams();

  const deckId = Number(id!);

  const containerFixed = useMatch('/decks/:deckId/cards');

  const deckQuery = useDeckData(deckId);

  return (
    <div className={`${styles.container} ${containerFixed ? styles['container--fixed'] : ''}`}>
      <main role='main' className={styles.content}>
        {deckQuery.isLoading && (
          <div className={styles.center}>
            <LoadingIndicator />
          </div>
        )}
        {deckQuery.isError && (
          <div className={styles.center}>
            <QueryError
              label={
                deckQuery.error instanceof Error
                  ? deckQuery.error.message
                  : 'Error retrieving information from server.'
              }
              refetchFn={deckQuery.refetch}
            />
          </div>
        )}
        {deckQuery.isSuccess && (
          <>
            <div className={styles.heading}>
              <h1 className={styles.heading__text}>{deckQuery.data.deckName}</h1>
              <BackButton href='/decks' label='Back to all decks' />
            </div>
            <div className={styles.routes}>
              <NavLink to='cards' className={styles.routes__link}>
                <TbCards aria-hidden='true' focusable='false' />
                Cards
              </NavLink>
              <NavLink to='tags' className={styles.routes__link}>
                <BsTags aria-hidden='true' focusable='false' />
                Tags
              </NavLink>
              <NavLink to='settings' className={styles.routes__link}>
                <IoSettingsOutline />
                Settings
              </NavLink>
            </div>
            <Outlet
              context={{
                deckId: deckQuery.data.id,
                deckTags: deckQuery.data.tags,
                deckName: deckQuery.data.deckName,
              }}
            />
          </>
        )}
      </main>
    </div>
  );
}

export function useDeckContext() {
  return useOutletContext<{ deckId: number; deckTags: TagData[]; deckName: string }>();
}
