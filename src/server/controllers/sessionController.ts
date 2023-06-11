import createError from 'http-errors';

import createErrorLog from '../utils/createErrorLog';

import type { ReqBodyLogin, ResLocalsLogin } from '../types';
import type { RequestHandler } from 'express-serve-static-core';

const createSession: RequestHandler<unknown, unknown, ReqBodyLogin, unknown, ResLocalsLogin> = (
  req,
  res,
  next
) => {
  const { userId } = res.locals;
  if (!userId)
    return next(
      createError(401, 'Error logging in. Please try again.', {
        log: createErrorLog('sessionController.createSession', 'Previous middleware error.'),
      })
    );

  req.session.userId = userId;
  return next();
};

export const sessionController = {
  createSession,
};
