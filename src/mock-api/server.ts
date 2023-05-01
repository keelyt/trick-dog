import { faker } from '@faker-js/faker';
import { createServer, Response } from 'miragejs';

import { factories } from './factories';
import { models } from './models';
import { serializers } from './serializers';

import type { AppSchema } from './types';

export function makeServer({ environment = 'test' } = {}) {
  const server = createServer({
    environment,
    models,
    factories,
    serializers,

    seeds(server) {
      server.createList('deck', faker.datatype.number({ min: 2, max: 10 })).forEach((deck) => {
        const tags = server.createList('tag', faker.datatype.number({ min: 3, max: 6 }), { deck });
        const cards = server.createList('card', faker.datatype.number({ min: 2, max: 25 }), {
          deck,
        });
        cards.forEach((card) => {
          const numTags = faker.datatype.number({ min: 1, max: 3 });
          card.tags = faker.helpers.arrayElements(tags, numTags);
          card.save();
        });
      });
    },

    routes() {
      this.namespace = 'api';
      this.timing = 1000; // 1000ms delay for responses

      this.get('/decks', (schema: AppSchema, request) => {
        return schema.all('deck');
      });

      this.post('/decks', (schema: AppSchema, request) => {
        const attrs: { deck_name: string } = JSON.parse(request.requestBody) as {
          deck_name: string;
        };

        if (!attrs.deck_name) return new Response(400, {}, { error: 'Deck name is required' });

        const newDeck = schema.create('deck', { deckName: attrs.deck_name });
        return schema.find('deck', newDeck.id);
      });

      this.get('/decks/:id', (schema: AppSchema, request) => {
        const { id } = request.params;

        if (!id || isNaN(parseInt(id))) return new Response(400, {}, { error: 'Invalid deck ID' });

        const deck = schema.find('deck', id);

        if (!deck) return new Response(404, {}, { error: 'Deck not found' });

        return deck;
      });

      this.delete('/decks/:id', (schema: AppSchema, request) => {
        const { id } = request.params;

        if (!id || isNaN(parseInt(id))) return new Response(400, {}, { error: 'Invalid deck ID' });

        const deck = schema.find('deck', id);

        if (!deck) return new Response(404, {}, { error: 'Deck not found' });

        deck.destroy();
        return deck;
      });

      this.get('/decks/:id/cards', (schema: AppSchema, request) => {
        const { id } = request.params;
        const { before, tag } = request.queryParams;

        return schema.where(
          'card',
          (card) =>
            card.deckId === id &&
            (!before || Date.parse(card.dateCreated) < Date.parse(before)) &&
            (!tag || card.tagIds.includes(tag))
        );
      });

      this.get('/decks/:id/tags', (schema: AppSchema, request) => {
        const { id } = request.params;

        if (!id || isNaN(parseInt(id))) return new Response(400, {}, { error: 'Invalid deck ID' });

        return schema.where('tag', (tag) => tag.deckId === id);
      });
    },
  });

  return server;
}
