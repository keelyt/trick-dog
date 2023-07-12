import createError from 'http-errors';

import {
  deleteTagQuery,
  insertDeckTagQuery,
  selectDeckTagsQuery,
  updateDeckTagQuery,
} from '../database/deckTagQueries';
import asyncMiddleware from '../utils/asyncMiddleware';
import createErrorLog from '../utils/createErrorLog';

import type {
  ReqBodyTag,
  ReqParamsDeck,
  ReqParamsTag,
  ResLocalsAuth,
  ResLocalsTag,
  ResLocalsTags,
} from '../types';

const addTag = asyncMiddleware<ReqParamsDeck, unknown, ReqBodyTag, unknown, ResLocalsTag>(
  async (req, res, next) => {
    const method = 'deckTagController.addTag';
    const errMessage = 'Error adding tag. Please try again.';

    const { userId } = res.locals;
    const { deckId } = req.params;
    const { tagName } = req.body;

    if (!deckId || isNaN(Number(deckId)))
      return next(
        createError(400, 'Invalid Deck ID.', {
          log: createErrorLog(method, `Provided deck ID (${deckId}) is not a number.`),
        })
      );

    if (!tagName)
      return next(
        createError(400, 'Tag name is required.', {
          log: createErrorLog(method, 'Tag name missing from request body.'),
        })
      );

    if (tagName.length > 50)
      return next(
        createError(400, 'Tag name must not exceed 50 characters.', {
          log: createErrorLog(method, 'Tag name in request exceeds 50 characters.'),
        })
      );

    try {
      const tag = await insertDeckTagQuery({ userId, deckId, tagName });
      if (!tag.rows.length)
        return next(
          createError(400, errMessage, {
            log: createErrorLog(method, 'Insert tag operation returned 0 rows.'),
          })
        );
      res.locals.tag = tag.rows[0];
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

const deleteTag = asyncMiddleware<ReqParamsTag, unknown, unknown, unknown, ResLocalsAuth>(
  async (req, res, next) => {
    const method = 'deckTagController.deleteTag';
    const errMessage = 'Error deleting tag.';

    const { userId } = res.locals;
    const { deckId, tagId } = req.params;

    if (!deckId || isNaN(Number(deckId)))
      return next(
        createError(400, 'Invalid Deck ID.', {
          log: createErrorLog(method, `Provided deck ID (${deckId}) is not a number.`),
        })
      );

    if (!tagId || isNaN(Number(tagId)))
      return next(
        createError(400, 'Invalid Tag ID.', {
          log: createErrorLog(method, `Provided card ID (${tagId}) is not a number.`),
        })
      );

    try {
      const tag = await deleteTagQuery({ userId, deckId, tagId });
      if (!tag.rowCount)
        return next(
          createError(404, 'Tag not found.', { log: createErrorLog(method, 'Tag not found.') })
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

const updateTag = asyncMiddleware<ReqParamsTag, unknown, ReqBodyTag, unknown, ResLocalsTag>(
  async (req, res, next) => {
    const method = 'deckTagController.updateTag';
    const errMessage = 'Error updating tag. Please try again.';

    const { userId } = res.locals;
    const { deckId, tagId } = req.params;
    const { tagName } = req.body;

    if (!deckId || isNaN(Number(deckId)))
      return next(
        createError(400, 'Invalid Deck ID.', {
          log: createErrorLog(method, `Provided deck ID (${deckId}) is not a number.`),
        })
      );

    if (!tagId || isNaN(Number(tagId)))
      return next(
        createError(400, 'Invalid Tag ID.', {
          log: createErrorLog(method, `Provided tag ID (${tagId}) is not a number.`),
        })
      );

    if (!tagName)
      return next(
        createError(400, 'Tag name is required.', {
          log: createErrorLog(method, 'Tag name missing from request body.'),
        })
      );

    if (tagName.length > 50)
      return next(
        createError(400, 'Tag name must not exceed 50 characters.', {
          log: createErrorLog(method, 'Tag name in request exceeds 50 characters.'),
        })
      );

    try {
      const tag = await updateDeckTagQuery({ userId, deckId, tagId, tagName });
      if (!tag.rows.length)
        return next(
          createError(404, 'Tag not found.', { log: createErrorLog(method, 'Tag not found.') })
        );
      res.locals.tag = tag.rows[0];
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
  addTag,
  deleteTag,
  getTags,
  updateTag,
};
