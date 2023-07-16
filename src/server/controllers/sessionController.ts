import createError from 'http-errors';

import { deleteSessionsQuery } from '../database/sessionQueries';
import asyncMiddleware from '../utils/asyncMiddleware';
import createErrorLog from '../utils/createErrorLog';

import type { ReqBodyLogin, ResLocals, ResLocalsAuth, ResLocalsLogin } from '../types';
import type { RequestHandler } from 'express-serve-static-core';

const createSession: RequestHandler<unknown, unknown, ReqBodyLogin, unknown, ResLocalsLogin> = (
  req,
  res,
  next
) => {
  const method = 'sessionController.createSession';
  const errMessage = 'Error logging in. Please try again.';

  const { userId } = res.locals;
  if (!userId)
    return next(
      createError(401, errMessage, { log: createErrorLog(method, 'Previous middleware error.') })
    );

  req.session.userId = userId;
  return next();
};

const deleteSession: RequestHandler<unknown, unknown, unknown, unknown, ResLocals> = (
  req,
  res,
  next
) => {
  const method = 'sessionController.deleteSession';
  const errMessage = 'An error occurred during logout.';

  req.session.destroy((err) => {
    if (err)
      return next(
        createError(500, errMessage, {
          log: createErrorLog(method, 'Error occurred while destroying session.'),
        })
      );
    res.clearCookie('tdsid');
    return next();
  });
};

const deleteSessions = asyncMiddleware<unknown, unknown, unknown, unknown, ResLocalsAuth>(
  async (req, res, next) => {
    const method = 'sessionController.deleteSessions';
    const errMessage = 'An error occurred during logout.';

    const { userId } = res.locals;

    try {
      // Delete all sessions for the user.
      await deleteSessionsQuery(userId);
      req.session.destroy((err) => {
        if (err)
          return next(
            createError(500, errMessage, {
              log: createErrorLog(method, 'Error occurred while destroying session.'),
            })
          );
        res.clearCookie('tdsid');
        return next();
      });
    } catch (error) {
      return next(
        createError(500, errMessage, {
          log: createErrorLog(method, 'Error occurred while deleting sessions.'),
        })
      );
    }
  }
);

const getStatus: RequestHandler<unknown, unknown, unknown, unknown, ResLocals> = (
  req,
  res,
  next
) => {
  const authed = !!res.locals.userId;
  if (!authed) return res.status(200).json({ authed: false });
  return next();
};

export const sessionController = {
  createSession,
  deleteSession,
  deleteSessions,
  getStatus,
};
