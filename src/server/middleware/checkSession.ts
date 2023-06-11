import type { ResLocals } from '../types';
import type { RequestHandler } from 'express-serve-static-core';

const checkSession: RequestHandler<unknown, unknown, unknown, unknown, ResLocals> = (
  req,
  res,
  next
) => {
  const userId = req.session.userId;
  if (userId) res.locals.userId = userId;
  return next();
};

export default checkSession;
