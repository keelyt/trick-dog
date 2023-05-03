import { forwardRef } from 'react';

import styles from './CardListItem.module.scss';

import type { ForwardedRef } from 'react';

interface CardListItemProps {
  question: string;
}

const CardListItem = forwardRef(
  ({ question }: CardListItemProps, ref?: ForwardedRef<HTMLLIElement>) => {
    return (
      <li ref={ref} className={styles.card}>
        {question}
      </li>
    );
  }
);

CardListItem.displayName = 'CardView';
export default CardListItem;
