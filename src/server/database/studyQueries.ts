import { query } from './db';

import type { CardData } from '../../types';

export const selectStudyCardsQuery = ({
  userId,
  decksWithoutTags,
  decksWithTags,
  tags,
}: {
  userId: number;
  decksWithoutTags: number[];
  decksWithTags: number[];
  tags: number[];
}) => {
  const queryString = `
  WITH filtered_cards AS (
    SELECT c.*
    FROM cards c
    INNER JOIN decks d
    ON c.deck_id = d.id
    WHERE
      (
        d.id = ANY($1::integer[])
        AND d.user_id = $2
      )
      OR (
        d.id = ANY($3::integer[])
        AND d.user_id = $2
        AND c.id IN (SELECT card_id FROM card_tags WHERE tag_id = ANY($4::integer[]))
      )
  )
  SELECT 
    id,
    deck_id AS "deckId",
    question,
    answer,
    attempt_count AS "attemptCount",
    correct_count AS "correctCount",
    created_at AS "dateCreated"
  FROM filtered_cards
  ORDER BY
    CASE
      WHEN date_last_reviewed IS NOT NULL THEN
        LEAST(2.00, extract(epoch FROM (CURRENT_TIMESTAMP - date_last_reviewed) / (60 * 60 * 24) / days_between_review))
      ELSE
        2.00
      END
  DESC
  LIMIT 15;
  `;

  const queryParams = [decksWithoutTags, userId, decksWithTags, tags];

  return query<CardData>(queryString, queryParams);
};
