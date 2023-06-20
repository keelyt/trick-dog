import createError from 'http-errors';

import { selectDeckTagsQuery } from '../database/deckTagQueries';
import asyncMiddleware from '../utils/asyncMiddleware';
import createErrorLog from '../utils/createErrorLog';

import type { ReqParamsDeck, ResLocalsTags } from '../types';

const getTags = asyncMiddleware<ReqParamsDeck, unknown, unknown, unknown, ResLocalsTags>(
  async (req, res, next) => {
    const method = 'deckTagController.getTags';
    const errMessage = 'Error retrieving tags from server.';

    const { userId } = res.locals;
    const { deckId } = req.params;

    if (!deckId || isNaN(Number(deckId)))
      return next(
        createError(400, 'Invalid Deck ID.', {
          log: createErrorLog(method, `Provided deck ID (${deckId}) is not a number.`),
        })
      );

    try {
      const tags = await selectDeckTagsQuery({ userId, deckId });
      res.locals.tags = tags.rows;
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

export const deckTagController = {
  getTags,
};
