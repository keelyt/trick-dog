import createError from 'http-errors';

import { query } from '../models/db';
import asyncMiddleware from '../utils/asyncMiddleware';
import createErrorLog from '../utils/createErrorLog';

import type { UserInfoData } from '../../types';
import type { ReqBodyLogin, ResLocalsLogin } from '../types';

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

    const queryString = `
    INSERT INTO users (sub, email, name, given_name, family_name, picture)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (sub)
    DO UPDATE
    SET name = $3, given_name = $4, family_name = $5, picture = $6, last_login_at = $7
    RETURNING id, email, picture;
    `;
    const queryParams = [
      sub,
      email,
      name,
      given_name,
      family_name,
      picture,
      new Date().toISOString(),
    ];

    try {
      const user = await query<UserInfoData & { id: string }>(queryString, queryParams);
      res.locals.userInfo = { email: user.rows[0].email, picture: user.rows[0].picture };
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

export const userController = {
  verifyOrAddUser,
};
