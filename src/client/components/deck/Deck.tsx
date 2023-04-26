import { NavLink } from 'react-router-dom';

import styles from './Deck.module.scss';

interface DeckProps {
  id: number;
  deckName: string;
  cardCount: number;
}

// TODO: Add more content to deck item (arrow icon, more deck info).

export default function Deck({ id, deckName, cardCount }: DeckProps): JSX.Element {
  return (
    <li>
      <NavLink to={`/decks/${id}`} className={styles.deck}>
        <h2>{deckName}</h2>
        <p>
          {cardCount} card{cardCount === 1 ? '' : 's'}
        </p>
      </NavLink>
    </li>
  );
}
