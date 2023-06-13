import createError from 'http-errors';

import { query } from '../models/db';
import asyncMiddleware from '../utils/asyncMiddleware';
import createErrorLog from '../utils/createErrorLog';

import type { DeckData } from '../../types';
import type { ResLocalsDecks } from '../types';

const getDecks = asyncMiddleware<unknown, unknown, unknown, unknown, ResLocalsDecks>(
  async (req, res, next) => {
    const method = 'deckController.getDecks';
    const errMessage = 'Error retrieving decks from server.';

    const { userId } = res.locals;
    if (!userId)
      return next(
        createError(500, errMessage, {
          log: createErrorLog(method, 'Previous middleware error.'),
        })
      );

    const queryString = `
    SELECT dc.*, ct.tags
    FROM (
      SELECT d.id, d.deck_name AS "deckName", COUNT(c.id) AS "cardCount"
      FROM decks d
      LEFT OUTER JOIN cards c
      ON c.deck_id = d.id
      WHERE d.user_id = $1
      GROUP BY d.id
    ) dc
    LEFT OUTER JOIN (
      SELECT deck_id, json_agg(json_build_object('id', id, 'tagName', tag_name, 'deckId', deck_id)) AS tags
      FROM tags
      GROUP BY deck_id
    ) ct
    ON ct.deck_id = dc.id;
    `;
    const queryParams = [userId];

    try {
      const decks = await query<DeckData>(queryString, queryParams);
      res.locals.decks = decks.rows;
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

export const deckController = {
  getDecks,
};
