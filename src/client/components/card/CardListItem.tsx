import { forwardRef } from 'react';
import { BsTrash3 } from 'react-icons/bs';

import useDeleteCard from '../../helpers/useDeleteCard';
import Button from '../ui/Button';

import styles from './CardListItem.module.scss';

import type { ForwardedRef } from 'react';

interface CardListItemProps {
  cardId: number;
  deckId: number;
  question: string;
  answer: string;
}

const CardListItem = forwardRef(
  ({ cardId, deckId, question, answer }: CardListItemProps, ref?: ForwardedRef<HTMLLIElement>) => {
    const deleteCard = useDeleteCard();

    return (
      <li ref={ref} className={styles.card}>
        {question}
        {answer}
        <div className={styles.buttons}>
          <Button
            as='button'
            type='button'
            onClick={() => deleteCard.mutate({ deckId, cardId })}
            disabled={deleteCard.isLoading}
            size='sm'
            colorScheme='card'
          >
            Delete
            <BsTrash3 style={{ color: 'red' }} />
          </Button>
          <Button as='link' href={`/decks/${deckId}/cards/${cardId}`} size='sm' colorScheme='card'>
            Edit
          </Button>
        </div>
      </li>
    );
  }
);

CardListItem.displayName = 'CardListItem';
export default CardListItem;
