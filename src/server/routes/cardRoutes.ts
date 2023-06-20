import { Router } from 'express';

import { cardController } from '../controllers/cardController';
import requireLogin from '../middleware/requireLogin';

import type {
  ReqBodyCard,
  ReqParamsCard,
  ReqParamsDeck,
  ReqQueryCards,
  ResLocalsAuth,
  ResLocalsCard,
  ResLocalsCards,
} from '../types';

const cardRouter = Router({ mergeParams: true });

cardRouter.use(requireLogin);

// Handle requests to /api/decks/:deckId/cards (GET, POST).
cardRouter
  .route('/')
  .get<ReqParamsDeck, unknown, unknown, ReqQueryCards, ResLocalsCards>(
    cardController.getCards,
    (req, res) => {
      return res.status(200).json({ cards: res.locals.cards });
    }
  )
  .post<ReqParamsDeck, unknown, ReqBodyCard, unknown, ResLocalsCard>(
    cardController.addCard,
    (req, res) => {
      return res.status(201).json({ card: res.locals.card });
    }
  );

// Handle requests to /api/decks/:deckId/cards/:cardId (DELETE, GET, PATCH).
cardRouter
  .route('/:cardId')
  .delete<ReqParamsCard, unknown, unknown, unknown, ResLocalsAuth>(
    cardController.deleteCard,
    (req, res) => {
      return res.status(200).json({ message: 'Successfully deleted.' });
    }
  )
  .get<ReqParamsCard, unknown, unknown, unknown, ResLocalsCard>(
    cardController.getCard,
    (req, res) => {
      return res.status(200).json({ card: res.locals.card });
    }
  )
  .patch<ReqParamsCard, unknown, ReqBodyCard, unknown, ResLocalsCard>(
    cardController.updateCard,
    (req, res) => {
      return res.status(200).json({ card: res.locals.card });
    }
  );

export default cardRouter;
