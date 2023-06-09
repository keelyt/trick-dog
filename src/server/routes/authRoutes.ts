import { Router } from 'express';

import { userController } from '../controllers/userController';
import verifyGoogleToken from '../middleware/verifyGoogleToken';

const authRouter = Router();

authRouter.post('/login', verifyGoogleToken, userController.verifyOrAddUser, (req, res) => {
  return res.status(200).json({ userInfo: res.locals.userInfo });
});

export default authRouter;
