import { faker } from '@faker-js/faker';
import { Factory } from 'miragejs';

export const TagFactory = Factory.extend({
  id(i) {
    return i;
  },
  tagName() {
    return faker.word.noun();
  },
});
