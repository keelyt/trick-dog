import { faker } from '@faker-js/faker';
import { Factory } from 'miragejs';

export const cardFactory = Factory.extend({
  id(i) {
    return i;
  },
  question() {
    return faker.word.words(faker.number.int({ min: 2, max: 15 }));
  },
  answer() {
    return faker.word.words(faker.number.int({ min: 2, max: 50 }));
  },
  dateCreated() {
    return new Date().toString();
  },
  attemptCount() {
    return 0;
  },
  correctCount() {
    return 0;
  },
  difficulty() {
    return 0.3;
  },
  daysBetweenReview() {
    return 3;
  },
  dateLastReviewed() {
    return '';
  },
});
