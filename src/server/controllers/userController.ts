import createError from 'http-errors';

import { selectUserQuery, upsertUserQuery } from '../database/userQueries';
import asyncMiddleware from '../utils/asyncMiddleware';
import createErrorLog from '../utils/createErrorLog';

import type { ReqBodyLogin, ResLocalsLogin, ResLocalsStatus } from '../types';

const verifyOrAddUser = asyncMiddleware<unknown, unknown, ReqBodyLogin, unknown, ResLocalsLogin>(
  async (req, res, next) => {
    const method = 'userController.verifyOrAddUser';
    const errMessage = 'Error logging in. Please try again.';

    const { googlePayload } = res.locals;

    if (!googlePayload)
      return next(
        createError(401, errMessage, {
          log: createErrorLog(method, 'Previous middleware error.'),
        })
      );

    const { sub, email, name, given_name, family_name, picture } = googlePayload;

    try {
      const user = await upsertUserQuery({ sub, email, name, given_name, family_name, picture });
      res.locals.userInfo = {
        email: user.rows[0].email,
        picture: user.rows[0].picture,
        name: user.rows[0].name,
      };
      res.locals.userId = user.rows[0].id;
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

const getUserInfo = asyncMiddleware<unknown, unknown, unknown, unknown, ResLocalsStatus>(
  async (req, res, next) => {
    const method = 'userController.getUserInfo';
    const errMessage = 'Error retrieving information from server.';

    const { userId } = res.locals;
    if (!userId)
      return next(
        createError(500, errMessage, {
          log: createErrorLog(method, 'Previous middleware error.'),
        })
      );

    try {
      const user = await selectUserQuery(userId);
      if (!user.rows.length)
        return next(
          createError(401, errMessage, {
            log: createErrorLog(method, 'UserId not found in database.'),
          })
        );
      res.locals.userInfo = {
        email: user.rows[0].email,
        picture: user.rows[0].picture,
        name: user.rows[0].name,
      };
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

export const userController = {
  verifyOrAddUser,
  getUserInfo,
};
