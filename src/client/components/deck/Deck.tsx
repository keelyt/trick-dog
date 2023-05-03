import { NavLink } from 'react-router-dom';

import { usePrefetchInfiniteCards } from '../../helpers/useInfiniteCardsData';

import styles from './Deck.module.scss';

interface DeckProps {
  deckId: number;
  deckName: string;
  cardCount: number;
}

// TODO: Add more content to deck item (arrow icon, more deck info).
// TODO: Add prefetchInfiniteQuery to prefetch first page of the deck's cards onMouseEnter

export default function Deck({ deckId, deckName, cardCount }: DeckProps): JSX.Element {
  const prefetchCards = usePrefetchInfiniteCards(deckId);

  return (
    <li onMouseEnter={prefetchCards}>
      <NavLink to={`/decks/${deckId}`} className={styles.deck}>
        <h2>{deckName}</h2>
        <p>
          {cardCount} card{cardCount === 1 ? '' : 's'}
        </p>
      </NavLink>
    </li>
  );
}
