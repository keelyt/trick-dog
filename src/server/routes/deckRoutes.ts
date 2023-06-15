import { Router } from 'express';

import { deckController } from '../controllers/deckController';
import requireLogin from '../middleware/requireLogin';

import type {
  ReqBodyDeck,
  ReqParamsDeck,
  ResLocalsDeck,
  ResLocalsDeckPatch,
  ResLocalsDecks,
} from '../types';

const deckRouter = Router();

deckRouter.use(requireLogin);

// Handle requests to /api/decks (GET, POST).
deckRouter
  .route('/')
  .get<unknown, unknown, unknown, unknown, ResLocalsDecks>(deckController.getDecks, (req, res) => {
    return res.status(200).json({ decks: res.locals.decks });
  })
  .post<unknown, unknown, ReqBodyDeck, unknown, ResLocalsDeck>(
    deckController.addDeck,
    (req, res) => {
      return res.status(201).json({ deck: res.locals.deck });
    }
  );

// Handle requests to /api/decks/:deckId (DELETE, GET, PATCH).
deckRouter
  .route('/:deckId')
  .delete<ReqParamsDeck, unknown, unknown, unknown, ResLocalsDeck>(
    deckController.deleteDeck,
    (req, res) => {
      return res.status(200).json({ message: 'Successfully deleted.' });
    }
  )
  .get<ReqParamsDeck, unknown, unknown, unknown, ResLocalsDeck>(
    deckController.getDeck,
    (req, res) => {
      return res.status(200).json({ deck: res.locals.deck });
    }
  )
  .patch<ReqParamsDeck, unknown, ReqBodyDeck, unknown, ResLocalsDeckPatch>(
    deckController.updateDeck,
    (req, res) => {
      return res.status(200).json({ deck: res.locals.deck });
    }
  );
export default deckRouter;
