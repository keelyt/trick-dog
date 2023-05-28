import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

import DeckStudyCheckbox from '../components/deck/DeckStudyCheckbox';
import FormError from '../components/form/FormError';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import QueryError from '../components/ui/QueryError';
import useDecksData from '../helpers/useDecksData';

import styles from './StudySelection.module.scss';

import type { DeckData } from '../../types';
import type { SetURLSearchParams } from 'react-router-dom';

export interface StudyFormValues {
  selection: string[];
}

interface StudySelectionProps {
  setSelectionParam: SetURLSearchParams;
}

export default function StudySelection({ setSelectionParam }: StudySelectionProps): JSX.Element {
  const decksQuery = useDecksData();

  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudyFormValues>({
    defaultValues: {
      selection: location.state
        ? (location.state as { selection: string }).selection.split(',')
        : [],
    },
  });
  const onSubmit = (data: StudyFormValues) => {
    setSelectionParam({ sel: data.selection.join(',') });
  };

  return (
    <main className={styles.content}>
      {decksQuery.isError ? (
        <QueryError
          label={
            decksQuery.error instanceof Error
              ? decksQuery.error.message
              : 'Error retrieving information from server.'
          }
          refetchFn={decksQuery.refetch}
        />
      ) : (
        <>
          <h1>Select Decks and Tags</h1>
          {decksQuery.isLoading ? (
            <div className={styles.form}>
              <LoadingIndicator />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <ul className={styles.form__list}>
                {decksQuery.data.map((deck: DeckData) => (
                  <DeckStudyCheckbox
                    key={deck.id}
                    register={register}
                    name='selection'
                    deckId={deck.id}
                    deckName={deck.deckName}
                    tags={deck.tags}
                  />
                ))}
              </ul>
              {errors.selection && errors.selection.type === 'required' && (
                <FormError errorMessage='Please make a selection.' />
              )}
              <button type='submit'>Study</button>
            </form>
          )}
        </>
      )}
    </main>
  );
}
