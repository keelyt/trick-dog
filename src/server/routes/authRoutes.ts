import { Router } from 'express';

import { sessionController } from '../controllers/sessionController';
import { userController } from '../controllers/userController';
import verifyGoogleToken from '../middleware/verifyGoogleToken';

import type { ReqBodyLogin, ResLocalsLogin, ResLocalsStatus } from '../types';

const authRouter = Router();

authRouter.get<unknown, unknown, unknown, unknown, ResLocalsStatus>(
  '/status',
  sessionController.getStatus,
  userController.getUserInfo,
  (req, res) => {
    return res.status(200).json({ authed: true, userInfo: res.locals.userInfo });
  }
);

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
