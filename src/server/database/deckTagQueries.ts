import { query } from './db';

import type { TagData } from '../../types';

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
