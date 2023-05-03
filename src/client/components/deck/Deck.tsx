import { NavLink } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { fetchCards } from '../../helpers/useInfiniteCardsData';

import styles from './Deck.module.scss';

interface DeckProps {
  deckId: number;
  deckName: string;
  cardCount: number;
}

// TODO: Add more content to deck item (arrow icon, more deck info).
// TODO: Add prefetchInfiniteQuery to prefetch first page of the deck's cards onMouseEnter

export default function Deck({ deckId, deckName, cardCount }: DeckProps): JSX.Element {
  const queryClient = useQueryClient();

  return (
    <li
      onMouseEnter={() =>
        queryClient.prefetchInfiniteQuery({
          queryKey: ['decks', deckId, 'cards', { LIMIT: 10 }],
          queryFn: ({ signal }) => fetchCards({ signal, deckId, LIMIT: 10 }),
        })
      }
    >
      <NavLink to={`/decks/${deckId}`} className={styles.deck}>
        <h2>{deckName}</h2>
        <p>
          {cardCount} card{cardCount === 1 ? '' : 's'}
        </p>
      </NavLink>
    </li>
  );
}
