import { faker } from '@faker-js/faker';
import { createServer } from 'miragejs';

import { factories } from './factories';
import cardHandler from './handlers/cardHandler';
import deckHandler from './handlers/deckHandler';
import tagHandler from './handlers/tagHandler';
import { models } from './models';
import { serializers } from './serializers';

export function makeServer({ environment = 'test' } = {}) {
  const server = createServer({
    environment,
    models,
    factories,
    serializers,

    // Create seed data for use in development
    seeds(server) {
      server.createList('deck', faker.number.int({ min: 2, max: 10 })).forEach((deck) => {
        const tags = server.createList('tag', faker.number.int({ min: 3, max: 6 }), { deck });
        const cards = server.createList('card', faker.number.int({ min: 2, max: 75 }), {
          deck,
        });
        cards.forEach((card) => {
          const numTags = faker.number.int({ min: 1, max: 3 });
          card.update({ tags: faker.helpers.arrayElements(tags, numTags) });
        });
      });
    },

    routes() {
      this.namespace = 'api'; // Base namespace used for all requests
      this.timing = 1000; // 1000ms delay for responses

      cardHandler(this);
      deckHandler(this);
      tagHandler(this);
    },
  });

  return server;
}
