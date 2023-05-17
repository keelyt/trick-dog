import { Response } from 'miragejs';

import type { AppSchema, AppServer } from '../types';

export default function tagHandler(server: AppServer) {
  server.get('/decks/:id/tags', (schema: AppSchema, request) => {
    const { id } = request.params;

    if (!id || isNaN(Number(id))) return new Response(400, {}, { error: 'Invalid deck ID' });

    return schema
      .where('tag', (tag) => tag.deckId === id)
      .sort((a, b) => {
        if (a.tagName.toLowerCase() > b.tagName.toLowerCase()) return 1;
        if (b.tagName.toLowerCase() > a.tagName.toLowerCase()) return -1;
        return 0;
      });
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
