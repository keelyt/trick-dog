import createError from 'http-errors';

import { insertCardQuery, selectCardQuery, selectCardsQuery } from '../database/cardQueries';
import asyncMiddleware from '../utils/asyncMiddleware';
import createErrorLog from '../utils/createErrorLog';

import type {
  ReqBodyCard,
  ReqParamsCard,
  ReqParamsDeck,
  ReqQueryCards,
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

export const cardController = {
  addCard,
  getCard,
  getCards,
};
