import { Router } from 'express';

import { deckTagController } from '../controllers/deckTagController';
import requireLogin from '../middleware/requireLogin';

import type { ReqParamsDeck, ResLocalsTags } from '../types';

const deckTagRouter = Router({ mergeParams: true });

deckTagRouter.use(requireLogin);

deckTagRouter
  .route('/')
  .get<ReqParamsDeck, unknown, unknown, unknown, ResLocalsTags>(
    deckTagController.getTags,
    (req, res) => {
      return res.status(200).json({ tags: res.locals.tags });
    }
  );

export default deckTagRouter;
