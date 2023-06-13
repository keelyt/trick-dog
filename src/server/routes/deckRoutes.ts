import { Router } from 'express';

import { deckController } from '../controllers/deckController';
import requireLogin from '../middleware/requireLogin';

import type { ResLocalsDecks } from '../types';

const deckRouter = Router();

deckRouter.get<unknown, unknown, unknown, unknown, ResLocalsDecks>(
  '/',
  requireLogin,
  deckController.getDecks,
  (req, res) => {
    return res.status(200).json({ decks: res.locals.decks });
  }
);

export default deckRouter;
