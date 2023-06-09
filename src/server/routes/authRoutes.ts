import { Router } from 'express';

import verifyGoogleToken from '../middleware/verifyGoogleToken';

const authRouter = Router();

authRouter.post('/login', verifyGoogleToken, (req, res) => {
  return res.status(200).json({ userInfo: res.locals.userInfo });
});

export default authRouter;
