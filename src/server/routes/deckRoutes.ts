import { Router } from 'express';

import { deckController } from '../controllers/deckController';
import requireLogin from '../middleware/requireLogin';

import type { ReqBodyDeckPost, ResLocalsDeck, ResLocalsDecks } from '../types';

const deckRouter = Router();

deckRouter.use(requireLogin);

deckRouter
  .route('/')
  .get<unknown, unknown, unknown, unknown, ResLocalsDecks>(deckController.getDecks, (req, res) => {
    return res.status(200).json({ decks: res.locals.decks });
  })
  .post<unknown, unknown, ReqBodyDeckPost, unknown, ResLocalsDeck>(
    deckController.addDeck,
    (req, res) => {
      return res.status(201).json({ deck: res.locals.deck });
    }
  );

export default deckRouter;
