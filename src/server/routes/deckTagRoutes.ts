import { Router } from 'express';

import { deckTagController } from '../controllers/deckTagController';
import requireLogin from '../middleware/requireLogin';

import type { ReqBodyTag, ReqParamsDeck, ResLocalsTag, ResLocalsTags } from '../types';

const deckTagRouter = Router({ mergeParams: true });

deckTagRouter.use(requireLogin);

// Handle requests to /api/decks/:deckId/tags (GET, POST).
deckTagRouter
  .route('/')
  .get<ReqParamsDeck, unknown, unknown, unknown, ResLocalsTags>(
    deckTagController.getTags,
    (req, res) => {
      return res.status(200).json({ tags: res.locals.tags });
    }
  )
  .post<ReqParamsDeck, unknown, ReqBodyTag, unknown, ResLocalsTag>(
    deckTagController.addTag,
    (req, res) => {
      return res.status(201).json({ tag: res.locals.tag });
    }
  );

export default deckTagRouter;
