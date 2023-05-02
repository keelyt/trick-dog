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
      this.namespace = 'api'; // Base namespace used for all requests
      this.timing = 1000; // 1000ms delay for responses

      cardHandler(this);
      deckHandler(this);
      tagHandler(this);
    },
  });

  return server;
}
