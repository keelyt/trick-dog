import { query } from './db.js';

export const deleteSessionsQuery = (userId: number) => {
  const queryString = `
  DELETE FROM sessions
  WHERE sess->>'userId' = $1;
  `;

  const queryParams = [userId];

  return query(queryString, queryParams);
};
