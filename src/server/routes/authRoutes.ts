import { Router } from 'express';

import { sessionController } from '../controllers/sessionController';
import { userController } from '../controllers/userController';
import verifyGoogleToken from '../middleware/verifyGoogleToken';

import type { ReqBodyLogin, ResLocals, ResLocalsLogin, ResLocalsStatus } from '../types';

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

authRouter.delete<unknown, unknown, unknown, unknown, ResLocals>(
  '/logout',
  sessionController.deleteSession,
  (req, res) => {
    return res.status(200).json({ message: 'Logout successful.' });
  }
);

export default authRouter;
