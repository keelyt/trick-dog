import createError from 'http-errors';

import {
  deleteDeckQuery,
  insertDeckQuery,
  selectDeckQuery,
  selectDecksQuery,
  updateDeckQuery,
} from '../database/deckQueries';
import asyncMiddleware from '../utils/asyncMiddleware';
import createErrorLog from '../utils/createErrorLog';

import type {
  ReqBodyDeck,
  ReqParamsDeck,
  ResLocalsAuth,
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

    try {
      const deck = await insertDeckQuery({ deckName, userId });
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

const deleteDeck = asyncMiddleware<ReqParamsDeck, unknown, unknown, unknown, ResLocalsAuth>(
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

    try {
      const deck = await deleteDeckQuery({ userId, deckId });
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

    try {
      const deck = await selectDeckQuery({ userId, deckId });
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

const getDecks = asyncMiddleware<unknown, unknown, unknown, unknown, ResLocalsDecks>(
  async (req, res, next) => {
    const method = 'deckController.getDecks';
    const errMessage = 'Error retrieving decks from server.';

    const { userId } = res.locals;

    try {
      const decks = await selectDecksQuery(userId);
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

  try {
    const deck = await updateDeckQuery({ deckName, userId, deckId });
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
