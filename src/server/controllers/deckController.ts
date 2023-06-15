import createError from 'http-errors';

import { query } from '../models/db';
import asyncMiddleware from '../utils/asyncMiddleware';
import createErrorLog from '../utils/createErrorLog';

import type { DeckData } from '../../types';
import type {
  ReqBodyDeck,
  ReqParamsDeck,
  ResLocalsDeck,
  ResLocalsDeckPatch,
  ResLocalsDecks,
} from '../types';

const addDeck = asyncMiddleware<unknown, unknown, ReqBodyDeck, unknown, ResLocalsDeck>(
  async (req, res, next) => {
    const method = 'deckController.addDeck';
    const errMessage = 'Error adding deck. Please try again';

    const { userId } = res.locals;
    const { deckName } = req.body;

    if (!deckName)
      return next(
        createError(400, 'Deck name is required.', {
          log: createErrorLog(method, 'Deck name missing from request body.'),
        })
      );

    if (deckName.length > 100)
      return next(
        createError(400, 'Deck name must not exceed 100 characters.', {
          log: createErrorLog(method, 'Deck name in request exceeds 100 characters.'),
        })
      );

    const queryString = `
    INSERT INTO decks (deck_name, user_id)
    VALUES ($1, $2)
    RETURNING id, deck_name AS "deckName";
    `;
    const queryParams = [deckName, userId];

    try {
      const deck = await query<Pick<DeckData, 'id' | 'deckName'>>(queryString, queryParams);
      res.locals.deck = { ...deck.rows[0], cardCount: 0, tags: [] };
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

const deleteDeck = asyncMiddleware<ReqParamsDeck, unknown, unknown, unknown, ResLocalsDeck>(
  async (req, res, next) => {
    const method = 'deckController.deleteDeck';
    const errMessage = 'Error deleting deck.';

    const { userId } = res.locals;
    const { deckId } = req.params;

    if (!deckId || isNaN(Number(deckId)))
      return next(
        createError(400, 'Invalid Deck ID.', {
          log: createErrorLog(method, `Provided deck ID (${deckId}) is not a number.`),
        })
      );

    // The database was configured with cascading deletes, so only need to delete from decks table.
    const queryString = `
    DELETE from decks
    WHERE user_id = $1 AND id = $2
    `;
    const queryParams = [userId, deckId];

    try {
      const deck = await query(queryString, queryParams);
      if (!deck.rowCount)
        return next(
          createError(404, 'Deck not found.', { log: createErrorLog(method, 'Deck not found.') })
        );
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

const getDecks = asyncMiddleware<unknown, unknown, unknown, unknown, ResLocalsDecks>(
  async (req, res, next) => {
    const method = 'deckController.getDecks';
    const errMessage = 'Error retrieving decks from server.';

    const { userId } = res.locals;

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

const getDeck = asyncMiddleware<ReqParamsDeck, unknown, unknown, unknown, ResLocalsDeck>(
  async (req, res, next) => {
    const method = 'deckController.getDeck';
    const errMessage = 'Error retrieving deck from server.';

    const { userId } = res.locals;
    const { deckId } = req.params;

    if (!deckId || isNaN(Number(deckId)))
      return next(
        createError(400, 'Invalid Deck ID.', {
          log: createErrorLog(method, `Provided deck ID (${deckId}) is not a number.`),
        })
      );

    const queryString = `
    SELECT dc.*, ct.tags
    FROM (
      SELECT d.id, d.deck_name AS "deckName", COUNT(c.id) AS "cardCount"
      FROM decks d
      LEFT OUTER JOIN cards c
      ON c.deck_id = d.id
      WHERE d.user_id = $1 AND d.id = $2
      GROUP BY d.id
    ) dc
    LEFT OUTER JOIN (
      SELECT deck_id, json_agg(json_build_object('id', id, 'tagName', tag_name, 'deckId', deck_id)) AS tags
      FROM tags
      WHERE deck_id = $2
      GROUP BY deck_id
    ) ct
    ON ct.deck_id = dc.id;
    `;
    const queryParams = [userId, deckId];

    try {
      const deck = await query<DeckData>(queryString, queryParams);
      if (!deck.rows.length)
        return next(
          createError(404, 'Deck not found.', { log: createErrorLog(method, 'Deck not found.') })
        );
      res.locals.deck = deck.rows[0];
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

const updateDeck = asyncMiddleware<
  ReqParamsDeck,
  unknown,
  ReqBodyDeck,
  unknown,
  ResLocalsDeckPatch
>(async (req, res, next) => {
  const method = 'deckController.updateDeck';
  const errMessage = 'Error updating deck. Please try again';

  const { userId } = res.locals;
  const { deckName } = req.body;
  const { deckId } = req.params;

  if (!deckId || isNaN(Number(deckId)))
    return next(
      createError(400, 'Invalid Deck ID.', {
        log: createErrorLog(method, `Provided deck ID (${deckId}) is not a number.`),
      })
    );

  if (!deckName)
    return next(
      createError(400, 'Deck name is required.', {
        log: createErrorLog(method, 'Deck name missing from request body.'),
      })
    );

  if (deckName.length > 100)
    return next(
      createError(400, 'Deck name must not exceed 100 characters.', {
        log: createErrorLog(method, 'Deck name in request exceeds 100 characters.'),
      })
    );

  const queryString = `
    UPDATE decks
    SET deck_name = $1
    WHERE user_id = $2 AND id = $3
    RETURNING id, deck_name AS "deckName";
    `;
  const queryParams = [deckName, userId, deckId];

  try {
    const deck = await query<Pick<DeckData, 'id' | 'deckName'>>(queryString, queryParams);
    if (!deck.rows.length)
      return next(
        createError(404, 'Deck not found.', { log: createErrorLog(method, 'Deck not found.') })
      );
    res.locals.deck = deck.rows[0];
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
});

export const deckController = {
  addDeck,
  deleteDeck,
  getDeck,
  getDecks,
  updateDeck,
};
