import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import CardListItem from './CardListItem';
import { useInfiniteCards } from '../../helpers/useInfiniteCardsData';
import LoadingSpinner from '../ui/LoadingSpinner';
import QueryError from '../ui/QueryError';

import styles from './CardsList.module.scss';

interface CardsListProps {
  deckId: number;
  tagId: number | null;
  search: string;
}

export default function CardsList({ deckId, tagId, search }: CardsListProps) {
  const { ref, inView } = useInView();
  const cardsQuery = useInfiniteCards({ deckId, tagId, search });

  // Fetch the next page if the last card is in view.
  // TODO: After styling, update this to fetch a little earlier.
  /*
   * In mapping the pages, change which card has the ref --
   * e.g. to fetch the next page when the 5th-from-bottom element is in view,
   * change if (i === page.length - 1) to if (i === page.length - 5)
   */
  useEffect(() => {
    if (inView && cardsQuery.hasNextPage) void cardsQuery.fetchNextPage();
  }, [inView, cardsQuery.fetchNextPage, cardsQuery.hasNextPage]);

  return (
    <div className={styles['list-container']}>
      {cardsQuery.isError && (
        <QueryError
          label={
            cardsQuery.error instanceof Error
              ? cardsQuery.error.message
              : 'Error retrieving information from server.'
          }
        />
      )}

      {cardsQuery.isLoading ? (
        <div className={styles.loading}>
          <LoadingSpinner />
        </div>
      ) : (
        <ul className={styles.list}>
          {cardsQuery.data?.pages.map((page) =>
            page.map((card, i) => (
              <CardListItem
                key={card.id}
                ref={i === page.length - 1 ? ref : undefined}
                deckId={deckId}
                cardId={card.id}
                question={card.question}
                answer={card.answer}
              />
            ))
          )}

          {cardsQuery.isFetchingNextPage && (
            <li>
              <LoadingSpinner />
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
