import { faker } from '@faker-js/faker';
import { Factory } from 'miragejs';

export const cardFactory = Factory.extend({
  id(i) {
    return i;
  },
  question() {
    return faker.word.noun();
  },
  answer() {
    return faker.word.adjective();
  },
  dateCreated() {
    return faker.date.past().toString();
  },
  attemptCount() {
    return faker.datatype.number({ min: 2, max: 25 });
  },
  correctCount() {
    return faker.datatype.number({ min: 2, max: 25 });
  },
});
