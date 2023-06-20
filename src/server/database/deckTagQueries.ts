import { query } from './db';

import type { TagData } from '../../types';

export const deleteTagQuery = ({
  userId,
  deckId,
  tagId,
}: {
  userId: number;
  deckId: string;
  tagId: string;
}) => {
  const queryString = `
  DELETE FROM tags
  WHERE id = $1
    AND deck_id = $2
    AND deck_id IN (SELECT id FROM decks WHERE user_id = $3);
  `;

  const queryParams = [Number(tagId), Number(deckId), userId];

  return query(queryString, queryParams);
};

export const insertDeckTagQuery = ({
  userId,
  deckId,
  tagName,
}: {
  userId: number;
  deckId: string;
  tagName: string;
}) => {
  const queryString = `
  INSERT INTO tags (tag_name, deck_id)
  SELECT $1, $2
  WHERE EXISTS (
    SELECT 1
    FROM decks
    WHERE id = $2
      AND user_id = $3
  )
  RETURNING id, tag_name AS "tagName", deck_id AS "deckId";
  `;
  const queryParams = [tagName, Number(deckId), userId];

  return query<TagData>(queryString, queryParams);
};

export const selectDeckTagsQuery = ({ userId, deckId }: { userId: number; deckId: string }) => {
  const queryString = `
  SELECT t.id, t.tag_name, t.deck_id
  FROM tags t
  INNER JOIN decks d
  ON d.id = t.deck_id
  WHERE d.user_id = $1
    AND t.deck_id = $2;
  `;
  const queryParams = [userId, Number(deckId)];

  return query<TagData>(queryString, queryParams);
};
