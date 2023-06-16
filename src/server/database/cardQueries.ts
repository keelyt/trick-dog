import { query } from './db';

import type { CardData } from '../../types';

export const selectCardsQuery = ({
  userId,
  deckId,
  q,
  before,
  tag,
  limit,
}: {
  userId: number;
  deckId: string;
  q?: string;
  before?: string;
  tag?: string;
  limit: string;
}) => {
  let paramIndex = 3;

  const queryString = `
    SELECT
      c.id,
      c.deck_id AS "deckId",
      c.question,
      c.answer,
      c.attempt_count as "attemptCount",
      c.correct_count AS "correctCount",
      c.created_at as "dateCreated"
    FROM cards c
    INNER JOIN decks d
    ON d.id = c.deck_id
    ${tag !== undefined ? `INNER JOIN card_tags ct ON ct.card_id = c.id` : ''}
    WHERE d.user_id = $1
      AND d.id = $2
      ${
        q !== undefined
          ? `AND (UPPER(c.question) LIKE '%' || UPPER($${paramIndex}) || '%' OR c.answer LIKE '%' || UPPER($${paramIndex++}) || '%')`
          : ''
      }
      ${before !== undefined ? `AND c.id < $${paramIndex++}` : ''}
      ${tag !== undefined ? `AND ct.tag_id = $${paramIndex++}` : ''}
    ORDER BY c.id DESC
    LIMIT $${paramIndex};
    `;

  const queryParams = [
    userId,
    Number(deckId),
    ...(q !== undefined ? [q] : []),
    ...(before !== undefined ? [Number(before)] : []),
    ...(tag !== undefined ? [Number(tag)] : []),
    Number(limit),
  ];

  return query<CardData>(queryString, queryParams);
};
