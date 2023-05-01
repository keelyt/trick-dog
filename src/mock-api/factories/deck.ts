import { faker } from '@faker-js/faker';
import { Factory } from 'miragejs';

export const DeckFactory = Factory.extend({
  id(i) {
    return i;
  },
  deckName() {
    return faker.word.noun();
  },
});
