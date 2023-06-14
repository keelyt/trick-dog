import { Router } from 'express';

import { deckController } from '../controllers/deckController';
import requireLogin from '../middleware/requireLogin';

import type { ReqBodyDeckPost, ResLocalsDeck, ResLocalsDecks } from '../types';

const deckRouter = Router();

deckRouter.get<unknown, unknown, unknown, unknown, ResLocalsDecks>(
  '/',
  requireLogin,
  deckController.getDecks,
  (req, res) => {
    return res.status(200).json({ decks: res.locals.decks });
  }
);

deckRouter.post<unknown, unknown, ReqBodyDeckPost, unknown, ResLocalsDeck>(
  '/',
  requireLogin,
  deckController.addDeck,
  (req, res) => {
    return res.status(200).json({ deck: res.locals.deck });
  }
);

export default deckRouter;
