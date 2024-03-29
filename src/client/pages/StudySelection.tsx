import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

import DeckStudyCheckbox from '../components/deck/DeckStudyCheckbox';
import Fieldset from '../components/form/Fieldset';
import FormError from '../components/form/FormError';
import Button from '../components/ui/Button';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import QueryError from '../components/ui/QueryError';
import useGetDecks from '../helpers/useGetDecks';

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
  const decksQuery = useGetDecks();

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
      {decksQuery.isError && (
        <QueryError
          label={
            decksQuery.error instanceof Error
              ? decksQuery.error.message
              : 'Error retrieving information from server.'
          }
          refetchFn={decksQuery.refetch}
        />
      )}
      {(decksQuery.isLoading || decksQuery.isSuccess) && (
        <>
          <h1 className={styles.heading}>Study Selection</h1>
          {decksQuery.isLoading && (
            <div className={styles.form}>
              <LoadingIndicator />
            </div>
          )}
          {decksQuery.isSuccess &&
            (decksQuery.data.length === 0 ? (
              <div className={styles.new}>
                <p className={styles.text}>Create some decks to get started!</p>
                <Button as='link' href='/decks'>
                  Go to Decks Page
                </Button>
              </div>
            ) : (
              <>
                <p className={styles.text}>
                  Select any combination of decks and tags to study. Selecting a deck will select
                  all cards in that deck, including cards without tags. Selecting a tag will select
                  cards in the deck with that tag.
                </p>
                <p className={styles.text}>
                  For keyboard users: when studying cards, press{' '}
                  <kbd className={styles.key}>Space</kbd> to reveal the answer,{' '}
                  <kbd className={styles.key}>1</kbd> for easy, <kbd className={styles.key}>2</kbd>{' '}
                  for medium, and <kbd className={styles.key}>3</kbd> for hard.
                </p>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                  <Fieldset caption='Select Decks and Tags to Study'>
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
                  </Fieldset>
                  {errors.selection && errors.selection.type === 'required' && (
                    <FormError errorMessage='Please make a selection.' />
                  )}
                  <Button as='button' type='submit'>
                    Study
                  </Button>
                </form>
              </>
            ))}
        </>
      )}
    </main>
  );
}
