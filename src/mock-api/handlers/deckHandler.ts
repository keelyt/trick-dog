import { Response } from 'miragejs';

import type { AppSchema, AppServer } from '../types';

export default function deckHandler(server: AppServer) {
  server.get('/decks', (schema: AppSchema) => {
    return schema.all('deck').sort((a, b) => {
      if (a.deckName.toLowerCase() > b.deckName.toLowerCase()) return 1;
      if (b.deckName.toLowerCase() > a.deckName.toLowerCase()) return -1;
      return 0;
    });
  });

  server.post('/decks', (schema: AppSchema, request) => {
    const attrs = JSON.parse(request.requestBody) as {
      deckName: string;
    };

    if (!attrs.deckName) return new Response(400, {}, { error: 'Deck name is required' });

    const newDeck = schema.create('deck', { deckName: attrs.deckName });
    return schema.findBy('deck', { id: newDeck.id });
  });

  server.get('/decks/:id', (schema: AppSchema, request) => {
    const { id } = request.params;

    if (!id || isNaN(Number(id))) return new Response(400, {}, { error: 'Invalid deck ID' });

    const deck = schema.findBy('deck', { id });

    if (!deck) return new Response(404, {}, { error: 'Deck not found' });

    return deck;
  });

  server.delete('/decks/:id', (schema: AppSchema, request) => {
    const { id } = request.params;

    if (!id || isNaN(Number(id))) return new Response(400, {}, { error: 'Invalid deck ID' });

    const deck = schema.findBy('deck', { id });

    if (!deck) return new Response(404, {}, { error: 'Deck not found' });

    deck.destroy();
    return deck;
  });

  server.patch('/decks/:id', (schema: AppSchema, request) => {
    const { id } = request.params;

    const { deckName } = JSON.parse(request.requestBody) as {
      deckName: string;
    };

    if (!id || isNaN(Number(id))) return new Response(400, {}, { error: 'Invalid deck ID' });

    const deck = schema.findBy('deck', { id });

    if (!deck) return new Response(404, {}, { error: 'Deck not found' });

    deck.update({
      deckName,
    });

    return deck;
  });
}
