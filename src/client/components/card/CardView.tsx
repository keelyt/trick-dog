import { forwardRef } from 'react';

import styles from './CardView.module.scss';

import type { ForwardedRef } from 'react';

interface CardViewProps {
  question: string;
}

const CardView = forwardRef(({ question }: CardViewProps, ref?: ForwardedRef<HTMLLIElement>) => {
  return (
    <li ref={ref} className={styles.card}>
      {question}
    </li>
  );
});

CardView.displayName = 'CardView';
export default CardView;
