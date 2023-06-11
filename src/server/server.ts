import { config } from 'dotenv';
config();

import path from 'path';

import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import { HttpError } from 'http-errors';

import { getSessionStore } from './models/db';
import authRouter from './routes/authRoutes';

import type { Express, NextFunction, Request, Response } from 'express';

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

const app: Express = express();

const PORT = Number(process.env.VITE_PORT ?? '3000');

// Set security headers.
app.use(helmet());

// Parse incoming requests as JSON.
app.use(express.json());

// Set up express sessions using PostgreSQL for session store.
// Note: since version 1.5.0 of express-session, cookie-parser is no longer needed.
// (See: https://expressjs.com/en/resources/middleware/session.html)
app.use(
  session({
    store: getSessionStore(session),
    name: 'tdsid',
    secret: process.env.COOKIE_SECRET as string | string[],
    resave: false,
    rolling: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: true,
      secure: process.env.NODE_ENV === 'production',
    },
  })
);

// Define routes.
app.use('/api/auth', authRouter);

// In production mode, serve static files from dist folder.
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(path.resolve(), 'dist')));
  app.get('/*', (req, res) => res.sendFile(path.join(path.resolve(), 'dist/client/index.html')));
}

// Global error handler
app.use((err: Error | HttpError, req: Request, res: Response, next: NextFunction) => {
  console.log(
    err instanceof HttpError ? err.log : 'Express error handler caught unknown middleware error.'
  );
  console.log(err.stack);
  const status = err instanceof HttpError ? err.status : 500;
  const message = err instanceof HttpError ? err.message : 'An error occurred.';
  return res.status(status).json({ error: message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

export default app;
