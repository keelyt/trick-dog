import { NavLink } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { fetchCards } from '../../helpers/useCardsInfiniteQuery';

import styles from './Deck.module.scss';

interface DeckProps {
  id: number;
  deckName: string;
  cardCount: number;
}

// TODO: Add more content to deck item (arrow icon, more deck info).
// TODO: Add prefetchInfiniteQuery to prefetch first page of the deck's cards onMouseEnter

export default function Deck({ id, deckName, cardCount }: DeckProps): JSX.Element {
  const queryClient = useQueryClient();
  return (
    <li
      onMouseEnter={() =>
        queryClient.prefetchInfiniteQuery({
          queryKey: ['decks', id, 'cards'],
          queryFn: ({ signal }) => fetchCards({ signal, deckId: id }),
        })
      }
    >
      <NavLink to={`/decks/${id}`} className={styles.deck}>
        <h2>{deckName}</h2>
        <p>
          {cardCount} card{cardCount === 1 ? '' : 's'}
        </p>
      </NavLink>
    </li>
  );
}
