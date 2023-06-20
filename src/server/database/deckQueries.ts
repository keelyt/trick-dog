import { query } from './db';

import type { DeckData } from '../../types';

export const deleteDeckQuery = ({ userId, deckId }: { userId: number; deckId: string }) => {
  // The database was configured with cascading deletes, so only need to delete from decks table.
  const queryString = `
  DELETE from decks
  WHERE user_id = $1 AND id = $2;
  `;
  const queryParams = [userId, Number(deckId)];

  return query(queryString, queryParams);
};

export const insertDeckQuery = ({ deckName, userId }: { deckName: string; userId: number }) => {
  const queryString = `
  INSERT INTO decks (deck_name, user_id)
  VALUES ($1, $2)
  RETURNING id, deck_name AS "deckName";
  `;
  const queryParams = [deckName, userId];

  return query<Pick<DeckData, 'id' | 'deckName'>>(queryString, queryParams);
};

export const selectDeckQuery = ({ userId, deckId }: { userId: number; deckId: string }) => {
  const queryString = `
  SELECT dc.*, COALESCE(ct.tags, '[]') AS tags
  FROM (
    SELECT d.id, d.deck_name AS "deckName", COUNT(c.id) AS "cardCount"
    FROM decks d
    LEFT OUTER JOIN cards c
    ON c.deck_id = d.id
    WHERE d.user_id = $1 AND d.id = $2
    GROUP BY d.id
  ) dc
  LEFT OUTER JOIN (
    SELECT deck_id, jsonb_agg(json_build_object('id', id, 'tagName', tag_name, 'deckId', deck_id) ORDER BY tag_name ASC) AS tags
    FROM tags
    WHERE deck_id = $2
    GROUP BY deck_id
  ) ct
  ON ct.deck_id = dc.id;
  `;
  const queryParams = [userId, Number(deckId)];

  return query<DeckData>(queryString, queryParams);
};

export const selectDecksQuery = (userId: number) => {
  const queryString = `
  SELECT dc.*, COALESCE(ct.tags, '[]') AS tags
  FROM (
    SELECT d.id, d.deck_name AS "deckName", COUNT(c.id) AS "cardCount"
    FROM decks d
    LEFT OUTER JOIN cards c
    ON c.deck_id = d.id
    WHERE d.user_id = $1
    GROUP BY d.id
  ) dc
  LEFT OUTER JOIN (
    SELECT deck_id, jsonb_agg(json_build_object('id', id, 'tagName', tag_name, 'deckId', deck_id) ORDER BY tag_name ASC) AS tags
    FROM tags
    GROUP BY deck_id
  ) ct
  ON ct.deck_id = dc.id;
  `;
  const queryParams = [userId];

  return query<DeckData>(queryString, queryParams);
};

export const updateDeckQuery = ({
  deckName,
  userId,
  deckId,
}: {
  deckName: string;
  userId: number;
  deckId: string;
}) => {
  const queryString = `
    UPDATE decks
    SET deck_name = $1
    WHERE user_id = $2 AND id = $3
    RETURNING id, deck_name AS "deckName";
    `;
  const queryParams = [deckName, userId, Number(deckId)];

  return query<Pick<DeckData, 'id' | 'deckName'>>(queryString, queryParams);
};
