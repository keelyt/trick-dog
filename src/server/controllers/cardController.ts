import createError from 'http-errors';

import {
  deleteCardQuery,
  insertCardQuery,
  selectCardQuery,
  selectCardsQuery,
  updateCardQuery,
} from '../database/cardQueries.js';
import asyncMiddleware from '../utils/asyncMiddleware.js';
import createErrorLog from '../utils/createErrorLog.js';

import type {
  ReqBodyCard,
  ReqParamsCard,
  ReqParamsDeck,
  ReqQueryCards,
  ResLocalsAuth,
  ResLocalsCard,
  ResLocalsCards,
} from '../types';

const addCard = asyncMiddleware<ReqParamsDeck, unknown, ReqBodyCard, unknown, ResLocalsCard>(
  async (req, res, next) => {
    const method = 'cardController.addCard';
    const errMessage = 'Error adding card. Please try again.';

    const { userId } = res.locals;
    const { deckId } = req.params;
    const { question, answer, tags = [] } = req.body;

    if (!deckId || isNaN(Number(deckId)))
      return next(
        createError(400, 'Invalid Deck ID.', {
          log: createErrorLog(method, `Provided deck ID (${deckId}) is not a number.`),
        })
      );

    if (!question)
      return next(
        createError(400, 'Front is required.', {
          log: createErrorLog(method, `Question missing from request body.`),
        })
      );
    if (!answer)
      return next(
        createError(400, 'Back is required.', {
          log: createErrorLog(method, `Answer missing from request body.`),
        })
      );

    try {
      const card = await insertCardQuery({ question, answer, deckId, userId, tags });
      if (!card.rows.length)
        return next(
          createError(400, errMessage, {
            log: createErrorLog(method, 'Insert card operation returned 0 rows.'),
          })
        );
      res.locals.card = card.rows[0];
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

const deleteCard = asyncMiddleware<ReqParamsCard, unknown, unknown, unknown, ResLocalsAuth>(
  async (req, res, next) => {
    const method = 'cardController.deleteCard';
    const errMessage = 'Error deleting card.';

    const { userId } = res.locals;
    const { deckId, cardId } = req.params;

    if (!deckId || isNaN(Number(deckId)))
      return next(
        createError(400, 'Invalid Deck ID.', {
          log: createErrorLog(method, `Provided deck ID (${deckId}) is not a number.`),
        })
      );

    if (!cardId || isNaN(Number(cardId)))
      return next(
        createError(400, 'Invalid Card ID.', {
          log: createErrorLog(method, `Provided card ID (${cardId}) is not a number.`),
        })
      );

    try {
      const card = await deleteCardQuery({ userId, deckId, cardId });
      if (!card.rowCount)
        return next(
          createError(404, 'Card not found.', { log: createErrorLog(method, 'Card not found.') })
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

const getCard = asyncMiddleware<ReqParamsCard, unknown, unknown, unknown, ResLocalsCard>(
  async (req, res, next) => {
    const method = 'cardController.getCard';
    const errMessage = 'Error retrieving card from server.';

    const { userId } = res.locals;
    const { deckId, cardId } = req.params;

    if (!deckId || isNaN(Number(deckId)))
      return next(
        createError(400, 'Invalid Deck ID.', {
          log: createErrorLog(method, `Provided deck ID (${deckId}) is not a number.`),
        })
      );

    if (!cardId || isNaN(Number(cardId)))
      return next(
        createError(400, 'Invalid Card ID.', {
          log: createErrorLog(method, `Provided card ID (${cardId}) is not a number.`),
        })
      );

    try {
      const card = await selectCardQuery({ cardId, deckId, userId });
      if (!card.rows.length)
        return next(
          createError(404, 'Card not found.', { log: createErrorLog(method, 'Card not found.') })
        );
      res.locals.card = card.rows[0];
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

const getCards = asyncMiddleware<ReqParamsDeck, unknown, unknown, ReqQueryCards, ResLocalsCards>(
  async (req, res, next) => {
    const method = 'cardController.getCards';
    const errMessage = 'Error retrieving cards from server.';

    const { userId } = res.locals;
    const { deckId } = req.params;
    const { before, tag, q, limit } = req.query;

    if (!deckId || isNaN(Number(deckId)))
      return next(
        createError(400, 'Invalid Deck ID.', {
          log: createErrorLog(method, `Provided deck ID (${deckId}) is not a number.`),
        })
      );

    if (!limit || isNaN(Number(limit)) || Number(limit) > 100)
      return next(
        createError(400, 'Page limit must be a number not exceeding 100.', {
          log: createErrorLog(method, `Provided page limit (${limit}) is not valid.`),
        })
      );

    try {
      const cards = await selectCardsQuery({ userId, deckId, q, before, tag, limit });
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

const updateCard = asyncMiddleware<ReqParamsCard, unknown, ReqBodyCard, unknown, ResLocalsCard>(
  async (req, res, next) => {
    const method = 'cardController.updateCard';
    const errMessage = 'Error updating card. Please try again.';

    const { userId } = res.locals;
    const { deckId, cardId } = req.params;
    const { question, answer, tags } = req.body;

    if (!deckId || isNaN(Number(deckId)))
      return next(
        createError(400, 'Invalid Deck ID.', {
          log: createErrorLog(method, `Provided deck ID (${deckId}) is not a number.`),
        })
      );

    if (!cardId || isNaN(Number(cardId)))
      return next(
        createError(400, 'Invalid Card ID.', {
          log: createErrorLog(method, `Provided card ID (${cardId}) is not a number.`),
        })
      );

    if (!question)
      return next(
        createError(400, 'Front is required.', {
          log: createErrorLog(method, `Question missing from request body.`),
        })
      );
    if (!answer)
      return next(
        createError(400, 'Back is required.', {
          log: createErrorLog(method, `Answer missing from request body.`),
        })
      );

    try {
      const card = await updateCardQuery({ question, answer, cardId, deckId, userId, tags });
      if (!card.rows.length)
        return next(
          createError(404, 'Card not found.', { log: createErrorLog(method, 'Card not found.') })
        );
      res.locals.card = card.rows[0];
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
  addCard,
  deleteCard,
  getCard,
  getCards,
  updateCard,
};
