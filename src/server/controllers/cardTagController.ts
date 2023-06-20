import createError from 'http-errors';

import { selectCardTagsQuery } from '../database/cardTagQueries';
import asyncMiddleware from '../utils/asyncMiddleware';
import createErrorLog from '../utils/createErrorLog';

import type { ReqParamsCard, ResLocalsCardTags } from '../types';

const getTags = asyncMiddleware<ReqParamsCard, unknown, unknown, unknown, ResLocalsCardTags>(
  async (req, res, next) => {
    const method = 'cardTagController.getTags';
    const errMessage = 'Error retrieving tags from server.';

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
      const tags = await selectCardTagsQuery({ userId, deckId, cardId });
      res.locals.tags = tags.rows.map((tag) => tag.id);
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

export const cardTagController = {
  getTags,
};
