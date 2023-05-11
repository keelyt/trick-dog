import { faker } from '@faker-js/faker';
import { Factory } from 'miragejs';

export const deckFactory = Factory.extend({
  id(i) {
    return i;
  },
  deckName() {
    return faker.word.noun();
  },
});
