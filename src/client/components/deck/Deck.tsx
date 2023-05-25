import { Link } from 'react-router-dom';

import { usePrefetchInfiniteCards } from '../../helpers/useInfiniteCardsData';

import styles from './Deck.module.scss';

interface DeckProps {
  deckId: number;
  deckName: string;
  cardCount: number;
}

// TODO: Add more content to deck item (arrow icon, more deck info).

export default function Deck({ deckId, deckName, cardCount }: DeckProps): JSX.Element {
  const prefetchCards = usePrefetchInfiniteCards(deckId);

  return (
    <li onMouseEnter={prefetchCards}>
      <Link to={`/decks/${deckId}/cards`} className={styles.deck}>
        <h2 className={styles.deck__title}>{deckName}</h2>
        <p className={styles.deck__details}>
          {cardCount} card{cardCount === 1 ? '' : 's'}
        </p>
      </Link>
    </li>
  );
}
