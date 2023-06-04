import { useCallback, useEffect, useState } from 'react';

import BackButton from '../components/ui/BackButton';
import Button from '../components/ui/Button';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import QueryError from '../components/ui/QueryError';
import useGetStudyCards from '../helpers/useGetStudyCards';
import useUpdateCardDifficulty from '../helpers/useUpdateCardDifficulty';

import styles from './StudyReviewer.module.scss';

export default function StudyReviewer({ selection }: { selection: string }) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answerRevealed, setAnswerRevealed] = useState<boolean>(false);
  const [mutatingLast, setMutatingLast] = useState<boolean>(false);

  const cardsQuery = useGetStudyCards(selection);
  const updateDifficulty = useUpdateCardDifficulty();

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (![' ', '1', '2', '3'].includes(event.key)) return;
      if (event.key === ' ' && !answerRevealed) setAnswerRevealed(true);
      else if (['1', '2', '3'].includes(event.key) && answerRevealed)
        handleSubmit(['Easy', 'Medium', 'Hard'][Number(event.key) - 1]);
    },
    [answerRevealed, cardsQuery.data, currentIndex, mutatingLast]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);
    // Return cleanup function.
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [handleKeydown]);

  const handleSubmit = (difficulty: string) => {
    if (!answerRevealed || !cardsQuery.data || !cardsQuery.data[currentIndex] || mutatingLast)
      return;
    const shouldRefetch = currentIndex >= cardsQuery.data.length - 1;
    // Keep track of status of mutation of last index (to prevent duplicate requests when on last index).
    if (shouldRefetch) setMutatingLast(true);

    updateDifficulty.mutate(
      {
        deckId: cardsQuery.data[currentIndex].deckId,
        cardId: cardsQuery.data[currentIndex].id,
        difficulty,
      },
      {
        onSettled: () => {
          if (shouldRefetch) {
            void cardsQuery.refetch();
            setCurrentIndex(0);
            setMutatingLast(false);
            setAnswerRevealed(false);
          }
        },
      }
    );

    if (!shouldRefetch) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setAnswerRevealed(false);
    }
  };

  return (
    <main className={styles.content}>
      <BackButton href='/study' label='Modify Selection' state={{ selection }} />
      {cardsQuery.isError && (
        <QueryError
          label='Error retrieving information from server.'
          refetchFn={cardsQuery.refetch}
        />
      )}
      {updateDifficulty.isError && (
        <div>There was an error updating the previous card&apos;s difficulty on the server.</div>
      )}
      {(cardsQuery.isLoading || cardsQuery.isRefetching || mutatingLast) &&
        (cardsQuery.isLoading ? <LoadingIndicator /> : <LoadingSpinner />)}
      {cardsQuery.isSuccess && !cardsQuery.isRefetching && !mutatingLast && (
        <>
          <div>{cardsQuery.data[currentIndex].question}</div>
          {answerRevealed && <div>{cardsQuery.data[currentIndex].answer}</div>}
        </>
      )}
      {!answerRevealed && (
        <Button
          as='button'
          type='button'
          colorScheme='secondary'
          title='Press space bar on keyboard'
          onClick={() => setAnswerRevealed(true)}
        >
          Show Answer
        </Button>
      )}
      {answerRevealed &&
        ['Easy', 'Medium', 'Hard'].map((difficulty, i) => (
          <Button
            key={difficulty}
            as='button'
            type='button'
            colorScheme='secondary'
            title={`Press ${[1, 2, 3][i]} on keyboard`}
            onClick={() => handleSubmit(difficulty)}
          >
            {difficulty}
          </Button>
        ))}
    </main>
  );
}
