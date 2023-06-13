import createError from 'http-errors';

import createErrorLog from '../utils/createErrorLog';

import type { ReqBodyLogin, ResLocals, ResLocalsLogin } from '../types';
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
  getStatus,
};
