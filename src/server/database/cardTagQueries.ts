import { query } from './db.js';

export const selectCardTagsQuery = ({
  userId,
  deckId,
  cardId,
}: {
  userId: number;
  deckId: string;
  cardId: string;
}) => {
  const queryString = `
  SELECT t.id
  FROM card_tags ct
  INNER JOIN tags t
  ON ct.tag_id = t.id
  INNER JOIN decks d
  ON t.deck_id = d.id
  WHERE ct.card_id = $1
    AND t.deck_id = $2
    AND d.user_id = $3
  ORDER BY t.tag_name ASC;
  `;
  const queryParams = [Number(cardId), Number(deckId), userId];

  return query<{ id: number }>(queryString, queryParams);
};
