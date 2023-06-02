import { useState } from 'react';

import BackButton from '../components/ui/BackButton';
import QueryError from '../components/ui/QueryError';
import useGetStudyCards from '../helpers/useGetStudyCards';
import useUpdateCardDifficulty from '../helpers/useUpdateCardDifficulty';

import styles from './StudyReviewer.module.scss';

export default function StudyReviewer({ selection }: { selection: string }) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const cardsQuery = useGetStudyCards(selection);
  const updateDifficulty = useUpdateCardDifficulty();

  const handleSubmit = (deckId: number, cardId: number, difficulty: string) => {
    const shouldRefetch = !cardsQuery.data || currentIndex >= cardsQuery.data.length - 1;
    if (!shouldRefetch) setCurrentIndex((prevIndex) => prevIndex + 1);

    updateDifficulty.mutate(
      { deckId, cardId, difficulty },
      {
        onSettled: () => {
          if (shouldRefetch) {
            void cardsQuery.refetch();
            setCurrentIndex(0);
          }
        },
      }
    );
  };

  return (
    <main className={styles.content}>
      <BackButton href='/study' label='ModifySelection' state={{ selection }} />
      {cardsQuery.isError && (
        <QueryError
          label='Error retrieving information from server.'
          refetchFn={cardsQuery.refetch}
        />
      )}
      {updateDifficulty.isError && (
        <div>There was an error updating the previous card&apos;s difficulty on the server.</div>
      )}
      {cardsQuery.isLoading && <div>Loading...</div>}
      {cardsQuery.isRefetching && <div>Fetching more cards...</div>}
      {cardsQuery.isSuccess && !cardsQuery.isRefetching && (
        <>
          <div>{cardsQuery.data[currentIndex].question}</div>
          <div>{cardsQuery.data[currentIndex].answer}</div>
          {['Easy', 'Medium', 'Hard'].map((difficulty) => (
            <button
              key={difficulty}
              onClick={() =>
                handleSubmit(
                  cardsQuery.data[currentIndex].deckId,
                  cardsQuery.data[currentIndex].id,
                  difficulty
                )
              }
            >
              {difficulty}
            </button>
          ))}
        </>
      )}
    </main>
  );
}
