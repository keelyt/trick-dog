import { Router } from 'express';

import { studyController } from '../controllers/studyController';
import requireLogin from '../middleware/requireLogin';

import type { ReqQueryStudy, ResLocalsCards } from '../types';

const studyRouter = Router();

studyRouter.use(requireLogin);

// Handle requests to /api/study (GET).
studyRouter
  .route('/')
  .get<unknown, unknown, unknown, ReqQueryStudy, ResLocalsCards>(
    studyController.getCards,
    (req, res) => {
      return res.status(200).json({ cards: res.locals.cards });
    }
  );

export default studyRouter;
