import { query } from './db.js';

import type { UserInfoData } from '../../types';

export const deleteUserQuery = (userId: number) => {
  // The database was configured with cascading deletes, so deleting user will delete all of the user's data.
  const queryString = `
  DELETE from users
  WHERE id = $1
  `;
  const queryParams = [userId];

  return query(queryString, queryParams);
};

export const selectUserQuery = (userId: number) => {
  const queryString = `
  SELECT email, picture, name
  FROM users
  WHERE id = $1;
  `;
  const queryParams = [userId];

  return query<UserInfoData>(queryString, queryParams);
};

export const upsertUserQuery = ({
  sub,
  email,
  name,
  given_name,
  family_name,
  picture,
}: {
  sub: string;
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}) => {
  const queryString = `
    INSERT INTO users (sub, email, name, given_name, family_name, picture)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (sub)
    DO UPDATE
    SET name = $3, given_name = $4, family_name = $5, picture = $6, last_login_at = $7
    RETURNING id, email, picture, name;
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

  return query<UserInfoData & { id: number }>(queryString, queryParams);
};
