import { query } from './db.js';

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
        LEAST(2, extract(epoch FROM (CURRENT_TIMESTAMP - date_last_reviewed) / (60 * 60 * 24) / days_between_review))
      ELSE
        2
      END
  DESC
  LIMIT 15;
  `;

  const queryParams = [decksWithoutTags, userId, decksWithTags, tags];

  return query<CardData>(queryString, queryParams);
};

export const updateDifficultyQuery = ({
  userId,
  deckId,
  cardId,
  difficulty,
}: {
  userId: number;
  deckId: string;
  cardId: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}) => {
  const difficulties = { Easy: 1, Medium: 0.5, Hard: 0 };
  const difficultyRating = difficulties[difficulty];

  const queryString = `
  WITH calc AS (
    SELECT
      id,
      LEAST(
        GREATEST(
          difficulty + (
            CASE WHEN $1::NUMERIC < 0.6 THEN
              1 
            ELSE
              CASE WHEN date_last_reviewed IS NOT NULL THEN
                LEAST(2, extract(epoch FROM (CURRENT_TIMESTAMP - date_last_reviewed) / (60 * 60 * 24) / days_between_review))
              ELSE
                0
              END
            END
          ) * (1::NUMERIC / 17) * (8 - 9 * $1::NUMERIC),
          0
        ),
        1
      ) AS upd_difficulty
    FROM (
      SELECT *
      FROM cards
      WHERE id = $2
        AND EXISTS (
          SELECT 1
          FROM decks
          WHERE id = $3
            AND user_id = $4
        )
    ) t
  )
  UPDATE cards
  SET
    difficulty = calc.upd_difficulty,
    days_between_review = days_between_review * (
      CASE WHEN $1::NUMERIC < 0.6 THEN
        LEAST(1, 1::NUMERIC / (1 + 3 * calc.upd_difficulty))
      ELSE
        1 + (2 - 1.7 * calc.upd_difficulty) * (
          CASE WHEN date_last_reviewed IS NOT NULL THEN
            LEAST(2, extract(epoch FROM (CURRENT_TIMESTAMP - date_last_reviewed) / (60 * 60 * 24) / days_between_review))
          ELSE
            0
          END
        ) * (random() * (1.05 - 0.95) + 0.95)
      END
    ),
    attempt_count = attempt_count + 1,
    correct_count = CASE WHEN $1::NUMERIC < 0.6 THEN correct_count ELSE correct_count + 1 END,
    date_last_reviewed = CURRENT_TIMESTAMP
  FROM calc
  WHERE cards.id = calc.id
  RETURNING cards.id, deck_id AS "deckId", question, answer, attempt_count AS "attemptCount", correct_count AS "correctCount", created_at AS "dateCreated";
  `;

  const queryParams = [difficultyRating, Number(cardId), Number(deckId), userId];

  return query<CardData>(queryString, queryParams);
};
