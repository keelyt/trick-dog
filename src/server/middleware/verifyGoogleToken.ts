import { OAuth2Client } from 'google-auth-library';
import createError from 'http-errors';

import asyncMiddleware from '../utils/asyncMiddleware';
import createErrorLog from '../utils/createErrorLog';

import type { ReqBodyLogin, ResLocalsLogin } from '../types';

const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

/**
 * Middleware to verify Google token.
 */
const verifyGoogleToken = asyncMiddleware<unknown, unknown, ReqBodyLogin, unknown, ResLocalsLogin>(
  async (req, res, next) => {
    const method = 'verifyGoogleToken';
    const errMessage = 'Invalid login attempt. Please try again.';

    const { credential } = req.body;

    if (!credential)
      return next(
        createError(400, errMessage, {
          log: createErrorLog(method, 'Google token missing from request body.'),
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
        createError(401, errMessage, {
          log: createErrorLog(method, 'Unable to validate Google token.'),
        })
      );
    }
  }
);

export default verifyGoogleToken;
