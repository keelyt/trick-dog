import { Router } from 'express';

import { cardTagController } from '../controllers/cardTagController.js';
import requireLogin from '../middleware/requireLogin.js';

import type { ReqParamsCard, ResLocalsCardTags } from '../types';

const cardTagRouter = Router({ mergeParams: true });

cardTagRouter.use(requireLogin);

// Handle requests to /api/decks/:deckId/cards/:cardId/tags (GET).
cardTagRouter
  .route('/')
  .get<ReqParamsCard, unknown, unknown, unknown, ResLocalsCardTags>(
    cardTagController.getTags,
    (req, res) => {
      return res.status(200).json({ tags: res.locals.tags });
    }
  );

export default cardTagRouter;
