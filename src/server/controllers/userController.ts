import { query } from '../models/db';
import asyncMiddleware from '../utils/asyncMiddleware';
import createError from '../utils/createError';

import type { UserInfoData } from '../../types';
import type { ReqBodyLogin, ResLocalsLogin } from '../types';

const verifyOrAddUser = asyncMiddleware<unknown, unknown, ReqBodyLogin, unknown, ResLocalsLogin>(
  async (req, res, next) => {
    const err = {
      method: 'userController.verifyOrAddUser',
      errMessage: 'Error logging in. Please try again.',
    };

    const { googlePayload } = res.locals;

    if (!googlePayload)
      return next(
        createError({
          ...err,
          status: 401,
          errDetail: 'Previous middleware error.',
        })
      );

    const { sub, email, name, given_name, family_name, picture } = googlePayload;

    const queryString = `
    INSERT INTO users (sub, email, name, given_name, family_name, picture)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (sub)
    DO UPDATE
    SET name = $3, given_name = $4, family_name = $5, picture = $6, last_login_at = $7
    RETURNING email, picture;
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
      const user = await query<UserInfoData>(queryString, queryParams);
      res.locals.userInfo = { email: user.rows[0].email, picture: user.rows[0].picture };
      return next();
    } catch (error) {
      return next(
        createError({
          ...err,
          status: 500,
          errDetail: 'Database error.',
        })
      );
    }
  }
);

export const userController = {
  verifyOrAddUser,
};
