import { Router } from 'express';

import { sessionController } from '../controllers/sessionController';
import { userController } from '../controllers/userController';
import verifyGoogleToken from '../middleware/verifyGoogleToken';

import type { ReqBodyLogin, ResLocals, ResLocalsLogin } from '../types';

const authRouter = Router();

authRouter.get<unknown, unknown, unknown, unknown, ResLocals>('/status', (req, res) => {
  const authed = !!res.locals.userId;
  return res.status(200).json({ authed });
});

authRouter.post<unknown, unknown, ReqBodyLogin, unknown, ResLocalsLogin>(
  '/login',
  verifyGoogleToken,
  userController.verifyOrAddUser,
  sessionController.createSession,
  (req, res) => {
    return res.status(200).json({ userInfo: res.locals.userInfo });
  }
);

export default authRouter;
