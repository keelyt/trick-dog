import { config } from 'dotenv';
config();

import path from 'path';

import cookieParser from 'cookie-parser';
import express from 'express';

import authRouter from './routes/authRoutes';

import type { ExpressError } from '../types';
import type { Express, NextFunction, Request, Response } from 'express';

const app: Express = express();

const PORT = Number(process.env.VITE_PORT ?? '3000');

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
app.use((err: ExpressError, req: Request, res: Response, next: NextFunction) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { error: 'An error occurred.' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

export default app;
