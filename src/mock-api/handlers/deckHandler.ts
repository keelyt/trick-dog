import { Response } from 'miragejs';

import type { AppSchema, AppServer } from '../types';

export default function deckHandler(server: AppServer) {
  server.get('/decks', (schema: AppSchema, request) => {
    return schema.all('deck').sort((a, b) => {
      if (a.deckName.toLowerCase() > b.deckName.toLowerCase()) return 1;
      if (b.deckName.toLowerCase() > a.deckName.toLowerCase()) return -1;
      return 0;
    });
  });

  server.post('/decks', (schema: AppSchema, request) => {
    const attrs: { deck_name: string } = JSON.parse(request.requestBody) as {
      deck_name: string;
    };

    if (!attrs.deck_name) return new Response(400, {}, { error: 'Deck name is required' });

    const newDeck = schema.create('deck', { deckName: attrs.deck_name });
    return schema.find('deck', newDeck.id);
  });

  server.get('/decks/:id', (schema: AppSchema, request) => {
    const { id } = request.params;

    if (!id || isNaN(parseInt(id))) return new Response(400, {}, { error: 'Invalid deck ID' });

    const deck = schema.find('deck', id);

    if (!deck) return new Response(404, {}, { error: 'Deck not found' });

    return deck;
  });

  server.delete('/decks/:id', (schema: AppSchema, request) => {
    const { id } = request.params;

    if (!id || isNaN(parseInt(id))) return new Response(400, {}, { error: 'Invalid deck ID' });

    const deck = schema.find('deck', id);

    if (!deck) return new Response(404, {}, { error: 'Deck not found' });

    deck.destroy();
    return deck;
  });
}
