import { OAuth2Client } from 'google-auth-library';

import asyncMiddleware from '../utils/asyncMiddleware';
import createError from '../utils/createError';

import type { ReqBodyLogin, ResLocalsLogin } from '../types';

const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

/**
 * Middleware to verify Google token.
 */
const verifyGoogleToken = asyncMiddleware<unknown, unknown, ReqBodyLogin, unknown, ResLocalsLogin>(
  async (req, res, next) => {
    const err = {
      method: 'verifyGoogleToken',
      errMessage: 'Invalid login attempt. Please try again.',
    };

    const { credential } = req.body;

    if (!credential)
      return next(
        createError({
          ...err,
          status: 400,
          errDetail: 'Google token missing from request body.',
        })
      );

    try {
      const token = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.VITE_GOOGLE_CLIENT_ID,
      });
      res.locals.googlePayload = token.getPayload();
      return next();
    } catch (error) {
      return next(
        createError({
          ...err,
          status: 401,
          errDetail: 'Unable to validate Google token.',
        })
      );
    }
  }
);

export default verifyGoogleToken;
