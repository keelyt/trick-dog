import { RestSerializer } from 'miragejs';

import type { CardResponse, CardsResponse } from '../../types';
import type { CardObject, CardsObject } from '../types';

export const cardSerializer = RestSerializer.extend({
  serialize(): CardResponse | CardsResponse {
    // This is how to call super, as Mirage borrows [Backbone's implementation of extend](http://backbonejs.org/#Model-extend)
    const json: CardObject | CardsObject = RestSerializer.prototype.serialize.apply(
      this,
      arguments
    );

    if ('card' in json) {
      return {
        card: {
          id: Number(json.card.id),
          deck_id: Number(json.card.deck),
          question: json.card.question,
          answer: json.card.answer,
          attempt_count: json.card.attemptCount,
          correct_count: json.card.correctCount,
          date_created: json.card.dateCreated,
        },
      };
    }

    if ('cards' in json) {
      return {
        cards: json.cards
          .slice(0, 10) // Limit to 10 cards per page.
          .sort((a, b) => Date.parse(b.dateCreated) - Date.parse(a.dateCreated)) // Sort by date descending.
          .map((card) => ({
            id: Number(card.id),
            deck_id: Number(card.deck),
            question: card.question,
            answer: card.answer,
            attempt_count: card.attemptCount,
            correct_count: card.correctCount,
            date_created: card.dateCreated,
          })),
      };
    }

    return json;
  },
});
