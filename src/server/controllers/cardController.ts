import createError from 'http-errors';

import { query } from '../models/db';
import asyncMiddleware from '../utils/asyncMiddleware';
import createErrorLog from '../utils/createErrorLog';

import type { CardData } from '../../types';
import type { ReqParamsDeck, ReqQueryCards, ResLocalsCards } from '../types';

const getCards = asyncMiddleware<ReqParamsDeck, unknown, unknown, ReqQueryCards, ResLocalsCards>(
  async (req, res, next) => {
    const method = 'cardController.getCards';
    const errMessage = 'Error retrieving cards from server.';

    const { userId } = res.locals;
    const { deckId } = req.params;
    const { before, tag, q, limit } = req.query;

    if (!limit || isNaN(Number(limit)) || Number(limit) > 100)
      return next(
        createError(400, 'Page limit must be a number not exceeding 100.', {
          log: createErrorLog(method, `Provided page limit (${limit}) is not valid.`),
        })
      );

    /*
     * Note: full-text search would be more efficient. The database is set up to use
     * textsearchable_index_col @@ to_tsquery('english', searchTerm). However, since it is
     * unknown what language the user's flashcards will be in, it makes more sense to use LIKE.
     */
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
    LIMIT $${paramIndex}
    `;

    const queryParams = [
      userId,
      Number(deckId),
      ...(q !== undefined ? [q] : []),
      ...(before !== undefined ? [Number(before)] : []),
      ...(tag !== undefined ? [Number(tag)] : []),
      Number(limit),
    ];

    try {
      const cards = await query<CardData>(queryString, queryParams);
      res.locals.cards = cards.rows;
      return next();
    } catch (error) {
      return next(
        createError(500, errMessage, {
          log: createErrorLog(
            method,
            error instanceof Error ? error.message : 'Unknown database error.'
          ),
        })
      );
    }
  }
);

export const cardController = {
  getCards,
};
