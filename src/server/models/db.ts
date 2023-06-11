import { config } from 'dotenv';
config();

import connectPgSimple from 'connect-pg-simple';
import pkg from 'pg';
const { Pool } = pkg;

import type { RequestHandler } from 'express';
import type { SessionOptions } from 'express-session';
import type { QueryResult, QueryResultRow } from 'pg';

const pool = new Pool({
  connectionString: process.env.PG_DB,
});

export function query<R extends QueryResultRow>(
  queryText: string,
  params: unknown[] = []
): Promise<QueryResult<R>> {
  return pool.query(queryText, params);
}

export function getSessionStore(session: (options?: SessionOptions) => RequestHandler) {
  const pgSession = connectPgSimple(session);
  return new pgSession({ pool, tableName: 'sessions', createTableIfMissing: true });
}
