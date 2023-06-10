import { config } from 'dotenv';
config();

import path from 'path';

import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import { HttpError } from 'http-errors';

import authRouter from './routes/authRoutes';

import type { Express, NextFunction, Request, Response } from 'express';

const app: Express = express();

const PORT = Number(process.env.VITE_PORT ?? '3000');

// Set security headers.
app.use(helmet());

// Parse incoming requests as JSON.
app.use(express.json());

// Parse cookies.
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cookieParser());

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
