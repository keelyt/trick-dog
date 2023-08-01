import createError from 'http-errors';

import { selectStudyCardsQuery, updateDifficultyQuery } from '../database/studyQueries.js';
import asyncMiddleware from '../utils/asyncMiddleware.js';
import createErrorLog from '../utils/createErrorLog.js';

import type {
  ReqBodyDifficulty,
  ReqParamsCard,
  ReqQueryStudy,
  ResLocalsCard,
  ResLocalsCards,
} from '../types';

const getCards = asyncMiddleware<unknown, unknown, unknown, ReqQueryStudy, ResLocalsCards>(
  async (req, res, next) => {
    const method = 'studyController.getCards';
    const errMessage = 'Error retrieving cards from server.';

    const { userId } = res.locals;
    const { sel } = req.query;

    if (!sel)
      return next(
        createError(400, 'Invalid selection.', {
          log: createErrorLog(method, `Study selection missing from request query.`),
        })
      );

    const decksWithoutTags: number[] = [];
    const decksWithTags: number[] = [];
    const tags: number[] = [];

    sel.split(',').forEach((selection) => {
      const [deckId, tagId] = selection.split('-');
      if (deckId && !tagId) decksWithoutTags.push(Number(deckId));
      if (deckId && tagId) {
        decksWithTags.push(Number(deckId));
        tags.push(Number(tagId));
      }
    });

    try {
      const cards = await selectStudyCardsQuery({ userId, decksWithoutTags, decksWithTags, tags });
      if (!cards.rows.length)
        return next(
          createError(404, 'No cards found for current selection.', {
            log: createErrorLog(method, 'Study card query returned 0 rows.'),
          })
        );
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

const updateCardDifficulty = asyncMiddleware<
  ReqParamsCard,
  unknown,
  ReqBodyDifficulty,
  unknown,
  ResLocalsCard
>(async (req, res, next) => {
  const method = 'studyController.updateCardDifficulty';
  const errMessage = 'Error updating card difficulty.';

  const { userId } = res.locals;
  const { deckId, cardId } = req.params;
  const { difficulty } = req.body;

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

  if (!['Easy', 'Medium', 'Hard'].includes(difficulty))
    return next(
      createError(400, 'Difficulty should be "Easy", "Medium", or "Hard".', {
        log: createErrorLog(method, `Invalid difficulty in request body (${difficulty}).`),
      })
    );

  try {
    const card = await updateDifficultyQuery({ userId, deckId, cardId, difficulty });
    if (!card.rows.length)
      return next(
        createError(500, errMessage, {
          log: createErrorLog(method, 'Update card difficulty query returned 0 rows.'),
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
});

export const studyController = {
  getCards,
  updateCardDifficulty,
};
