import { config } from 'dotenv';
config();

import path from 'path';

import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import { HttpError } from 'http-errors';

import { getSessionStore } from './database/db.js';
import checkSession from './middleware/checkSession.js';
import authRouter from './routes/authRoutes.js';
import cardRouter from './routes/cardRoutes.js';
import cardTagRouter from './routes/cardTagRoutes.js';
import deckRouter from './routes/deckRoutes.js';
import deckTagRouter from './routes/deckTagRoutes.js';
import studyRouter from './routes/studyRoutes.js';

import type { Express, NextFunction, Request, Response } from 'express';

// TODO: Improve validation (using Zod?).
// TODO: Add testing.

declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

const app: Express = express();

const PORT = Number(process.env.VITE_PORT ?? '3000');

// In production mode, serve static files from dist folder.
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(path.resolve(), 'dist')));
}

// Set security headers.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'img-src': ["'self'", 'lh3.googleusercontent.com'],
        'script-src': ["'self'", 'accounts.google.com'],
        'frame-src': ["'self'", 'accounts.google.com'],
      },
    },
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    referrerPolicy: {
      policy:
        process.env.NODE_ENV === 'production'
          ? 'strict-origin-when-cross-origin' // For production
          : 'no-referrer-when-downgrade', // For testing using http and local host
    },
  })
);

// Parse incoming requests as JSON.
app.use(express.json());

// Set up express sessions using PostgreSQL for session store.
// Note: since version 1.5.0 of express-session, cookie-parser is no longer needed.
// (See: https://expressjs.com/en/resources/middleware/session.html)
app.use(
  session({
    store: getSessionStore(session),
    name: 'tdsid',
    proxy: true,
    secret: process.env.COOKIE_SECRET as string | string[],
    resave: false,
    rolling: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : true,
      secure: process.env.NODE_ENV === 'production', // Disable if testing using http
      domain: process.env.NODE_ENV === 'production' ? '.trickdog.keelyt.com' : undefined,
    },
  })
);

// Check session status and get current user's userId.
app.use(checkSession);

// Define routes.
app.use('/api/auth', authRouter);
app.use('/api/study', studyRouter);
app.use('/api/decks/:deckId/cards/:cardId/tags', cardTagRouter);
app.use('/api/decks/:deckId/cards', cardRouter);
app.use('/api/decks/:deckId/tags', deckTagRouter);
app.use('/api/decks', deckRouter);

// In production mode, serve index.html from dist folder.
if (process.env.NODE_ENV === 'production') {
  app.get('/*', (req, res) => res.sendFile(path.join(path.resolve(), 'dist/index.html')));
}

// Global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
