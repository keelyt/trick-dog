import type { RequestHandler } from 'express';
import type { ParamsDictionary, Query } from 'express-serve-static-core';

/**
 * Express async middleware wrapper.
 * @template P Express request params.
 * @template ResBody Express response body.
 * @template ReqBody Express request body.
 * @template ReqQuery Express request query.
 * @template Locals Express response locals.
 * @param fn Request handler function.
 * @returns Express request handler.
 */
export default function asyncMiddleware<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query,
  Locals extends Record<string, any> = Record<string, any>
>(
  fn: (...args: Parameters<RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>>) => Promise<void>
): RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
