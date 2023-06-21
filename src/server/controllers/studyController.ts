import createError from 'http-errors';

import { selectStudyCardsQuery } from '../database/studyQueries';
import asyncMiddleware from '../utils/asyncMiddleware';
import createErrorLog from '../utils/createErrorLog';

import type { ReqQueryStudy, ResLocalsCards } from '../types';

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

export const studyController = {
  getCards,
};
