import createError from 'http-errors';

import { selectCardsQuery } from '../database/cardQueries';
import { query } from '../database/db';
import asyncMiddleware from '../utils/asyncMiddleware';
import createErrorLog from '../utils/createErrorLog';

import type { CardData } from '../../types';
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

    const queryString = `
    WITH
    ins_card AS (
      INSERT INTO cards (question, answer, deck_id)
      SELECT $1, $2, $3
      WHERE EXISTS (
        SELECT 1
        FROM decks
        WHERE id = $3
        AND user_id = $4
      )
      RETURNING id, deck_id AS "deckId", question, answer, attempt_count as "attemptCount", correct_count AS "correctCount", created_at as "dateCreated"
    ),
    ins_tags as (
      INSERT INTO card_tags (tag_id, card_id)
      SELECT unnest($5::integer[]), id
      FROM ins_card
    )
    SELECT * FROM ins_card;
    `;

    const queryParams = [question, answer, deckId, userId, tags];

    try {
      const card = await query<CardData>(queryString, queryParams);
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
    WHERE c.id = $1
      AND d.id = $2
      AND d.user_id = $3;
    `;

    const queryParams = [cardId, deckId, userId];

    try {
      const card = await query<CardData>(queryString, queryParams);
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
