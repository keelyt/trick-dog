import { Response } from 'miragejs';

import type { AppSchema, AppServer } from '../types';

export default function tagHandler(server: AppServer) {
  server.get('/decks/:id/tags', (schema: AppSchema, request) => {
    const { id } = request.params;

    if (!id || isNaN(parseInt(id))) return new Response(400, {}, { error: 'Invalid deck ID' });

    return schema.where('tag', (tag) => tag.deckId === id);
  });
}
