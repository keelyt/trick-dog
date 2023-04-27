import { useParams } from 'react-router-dom';

import fetchWithError from '../helpers/fetchWithError';

import type { CardData } from '../types';

// TODO: Because user could have a lot of cards in one deck,
// should add pagination, caching (react query), search functionality
// filter functionality (filter by tag), and sort functionality

export default function EditDeck(): JSX.Element {
  const { deckId } = useParams();

  const fetchCards = async (before = '', signal: AbortSignal): Promise<CardData[]> => {
    const queryString = before ? `?before=${encodeURIComponent(before)}` : '';
    return await fetchWithError(`/api/decks/:deckId/cards${queryString}`, { signal });
  };

  return <div>EditDeck {deckId}</div>;
}
