import { Router } from 'express';

import { sessionController } from '../controllers/sessionController.js';
import { userController } from '../controllers/userController.js';
import requireLogin from '../middleware/requireLogin.js';
import verifyGoogleToken from '../middleware/verifyGoogleToken.js';

import type {
  ReqBodyLogin,
  ResLocals,
  ResLocalsAuth,
  ResLocalsLogin,
  ResLocalsStatus,
} from '../types';

const authRouter = Router();

authRouter.delete<unknown, unknown, unknown, unknown, ResLocalsAuth>(
  '/delete-account',
  requireLogin,
  userController.deleteUser,
  sessionController.deleteSessions,
  (req, res) => {
    return res.status(200).json({ message: 'Account deleted successfully.' });
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
  requireLogin,
  sessionController.deleteSession,
  (req, res) => {
    return res.status(200).json({ message: 'Logout successful.' });
  }
);

authRouter.delete<unknown, unknown, unknown, unknown, ResLocalsAuth>(
  '/logout-all',
  requireLogin,
  sessionController.deleteSessions,
  (req, res) => {
    return res.status(200).json({ message: 'Logout successful.' });
  }
);

authRouter.get<unknown, unknown, unknown, unknown, ResLocalsStatus>(
  '/status',
  sessionController.getStatus,
  userController.getUserInfo,
  (req, res) => {
    return res.status(200).json({ authed: true, userInfo: res.locals.userInfo });
  }
);

export default authRouter;
