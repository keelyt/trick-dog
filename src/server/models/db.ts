import { config } from 'dotenv';
config();

import pkg from 'pg';
const { Pool } = pkg;

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
