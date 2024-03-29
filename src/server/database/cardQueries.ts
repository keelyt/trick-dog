import { query } from './db.js';

import type { CardData } from '../../types';

export const deleteCardQuery = ({
  userId,
  deckId,
  cardId,
}: {
  userId: number;
  deckId: string;
  cardId: string;
}) => {
  // The database was configured with cascading deletes, so deleting card will delete related rows in card_tags.
  const queryString = `
  DELETE FROM cards
  WHERE id = $1
    AND deck_id = $2
    AND deck_id IN (SELECT id FROM decks WHERE user_id = $3);
  `;

  const queryParams = [Number(cardId), Number(deckId), userId];

  return query(queryString, queryParams);
};

export const insertCardQuery = ({
  question,
  answer,
  deckId,
  userId,
  tags,
}: {
  question: string;
  answer: string;
  deckId: string;
  userId: number;
  tags: number[];
}) => {
  const queryString = `
    WITH
    ins_card AS (
      INSERT INTO cards (question, answer, deck_id)
      SELECT $1, $2, $3
      FROM decks
      WHERE id = $3
        AND user_id = $4
      RETURNING id, deck_id AS "deckId", question, answer, attempt_count AS "attemptCount", correct_count AS "correctCount", created_at AS "dateCreated"
    ),
    ins_tags AS (
      INSERT INTO card_tags (tag_id, card_id)
      SELECT unnest($5::integer[]), id
      FROM ins_card
    )
    SELECT * FROM ins_card;
    `;

  const queryParams = [question, answer, Number(deckId), userId, tags];

  return query<CardData>(queryString, queryParams);
};

export const selectCardQuery = ({
  cardId,
  deckId,
  userId,
}: {
  cardId: string;
  deckId: string;
  userId: number;
}) => {
  const queryString = `
  SELECT
    c.id,
    c.deck_id AS "deckId",
    c.question,
    c.answer,
    c.attempt_count AS "attemptCount",
    c.correct_count AS "correctCount",
    c.created_at AS "dateCreated"
  FROM cards c
  INNER JOIN decks d
  ON d.id = c.deck_id
  WHERE c.id = $1
    AND d.id = $2
    AND d.user_id = $3;
  `;

  const queryParams = [Number(cardId), Number(deckId), userId];

  return query<CardData>(queryString, queryParams);
};

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
      c.attempt_count AS "attemptCount",
      c.correct_count AS "correctCount",
      c.created_at AS "dateCreated"
    FROM cards c
    INNER JOIN decks d
    ON d.id = c.deck_id
    ${tag !== undefined ? `INNER JOIN card_tags ct ON ct.card_id = c.id` : ''}
    WHERE d.user_id = $1
      AND d.id = $2
      ${
        q !== undefined
          ? `AND (UPPER(c.question) LIKE '%' || UPPER($${paramIndex}) || '%' OR UPPER(c.answer) LIKE '%' || UPPER($${paramIndex++}) || '%')`
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

export const updateCardQuery = ({
  question,
  answer,
  cardId,
  deckId,
  userId,
  tags,
}: {
  question: string;
  answer: string;
  cardId: string;
  deckId: string;
  userId: number;
  tags?: number[];
}) => {
  const queryString = `
  WITH
  upd_card AS (
    UPDATE cards
    SET question = $1, answer = $2
    WHERE id = $3
      AND EXISTS (
        SELECT 1
        FROM decks
        WHERE id = $4
        AND user_id = $5
      )
    RETURNING id, deck_id AS "deckId", question, answer, attempt_count AS "attemptCount", correct_count AS "correctCount", created_at AS "dateCreated"
  )${
    tags !== undefined
      ? `,
  del_tags AS (
    DELETE from card_tags
    WHERE card_id = $3
  ),
  ins_tags AS (
    INSERT INTO card_tags (tag_id, card_id)
    SELECT unnest($6::integer[]), id
    FROM upd_card
  )`
      : ''
  }
  SELECT * FROM upd_card;
  `;

  const queryParams = [
    question,
    answer,
    Number(cardId),
    Number(deckId),
    userId,
    ...(tags !== undefined ? [tags] : []),
  ];

  return query<CardData>(queryString, queryParams);
};
