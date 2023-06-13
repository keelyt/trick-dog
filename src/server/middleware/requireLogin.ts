import createError from 'http-errors';

import createErrorLog from '../utils/createErrorLog';

import type { ResLocals } from '../types';
import type { RequestHandler } from 'express';

const requireLogin: RequestHandler<unknown, unknown, unknown, unknown, ResLocals> = (
  req,
  res,
  next
) => {
  const method = 'requireLogin';
  const errMessage = 'Authorization required.';

  const authed = !!res.locals.userId;
  if (!authed)
    return next(
      createError(401, errMessage, {
        log: createErrorLog(method, 'Unable to verify session.'),
      })
    );
  return next();
};

export default requireLogin;
