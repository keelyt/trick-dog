import { forwardRef } from 'react';
import { BsTrash3 } from 'react-icons/bs';
import { CiEdit } from 'react-icons/ci';

import { usePrefetchCardTagsData } from '../../helpers/useCardTagsData';
import useDeleteCard from '../../helpers/useDeleteCard';
import Button from '../ui/Button';

import styles from './CardListItem.module.scss';

import type { ForwardedRef } from 'react';

interface CardListItemProps {
  cardId: number;
  deckId: number;
  question: string;
  answer: string;
  tagId: number | null; // The current tag filter (used for optimistic update)
  search: string; // The current search string (used for optimistic update)
}

const CardListItem = forwardRef(
  (
    { cardId, deckId, question, answer, tagId, search }: CardListItemProps,
    ref?: ForwardedRef<HTMLLIElement>
  ) => {
    const deleteCard = useDeleteCard();
    const prefetchTags = usePrefetchCardTagsData(deckId, cardId);

    return (
      <li ref={ref} className={styles.card}>
        <div className={styles.card__row}>{question}</div>
        <div className={styles.card__row}>{answer}</div>
        <div className={styles.buttons}>
          <Button
            as='button'
            type='button'
            onClick={() => deleteCard.mutate({ deckId, cardId, tagId, search })}
            disabled={deleteCard.isLoading}
            size='sm'
            colorScheme='card'
            rounded={false}
          >
            <BsTrash3 aria-hidden='true' focusable='false' />
            Delete
          </Button>
          <Button
            as='link'
            href={`/decks/${deckId}/cards/${cardId}`}
            state={{ tagId, search }}
            size='sm'
            colorScheme='card'
            rounded={false}
            onMouseEnter={prefetchTags}
          >
            <CiEdit aria-hidden='true' focusable='false' />
            Edit
          </Button>
        </div>
      </li>
    );
  }
);

CardListItem.displayName = 'CardListItem';
export default CardListItem;
