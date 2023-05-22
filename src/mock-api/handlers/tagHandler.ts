import { Response } from 'miragejs';

import type { AppSchema, AppServer } from '../types';

export default function tagHandler(server: AppServer) {
  server.get('/decks/:deckId/tags', (schema: AppSchema, request) => {
    const { deckId } = request.params;

    if (!deckId || isNaN(Number(deckId)))
      return new Response(400, {}, { error: 'Invalid deck ID' });

    return schema
      .where('tag', (tag) => tag.deckId === deckId)
      .sort((a, b) => {
        if (a.tagName.toLowerCase() > b.tagName.toLowerCase()) return 1;
        if (b.tagName.toLowerCase() > a.tagName.toLowerCase()) return -1;
        return 0;
      });
  });

  server.delete('/decks/:deckId/tags/:tagId', (schema: AppSchema, request) => {
    const { deckId, tagId } = request.params;

    const tag = schema.findBy('tag', { id: tagId, deckId });

    if (!tag) return new Response(404, {}, { error: 'Card not found' });

    tag.destroy();
    return tag;
  });

  server.get('/decks/:deckId/cards/:cardId/tags', (schema: AppSchema, request) => {
    const { deckId, cardId } = request.params;

    if (!deckId || isNaN(Number(deckId)))
      return new Response(400, {}, { error: 'Invalid deck ID' });

    if (!cardId || isNaN(Number(cardId)))
      return new Response(400, {}, { error: 'Invalid card ID' });

    return schema
      .where('tag', (tag) => tag.deckId === deckId && tag.cardIds.includes(cardId))
      .sort((a, b) => {
        if (a.tagName.toLowerCase() > b.tagName.toLowerCase()) return 1;
        if (b.tagName.toLowerCase() > a.tagName.toLowerCase()) return -1;
        return 0;
      });
  });
}
