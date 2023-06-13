import { RestSerializer } from 'miragejs';

import type { CardData, CardResponse, CardsResponse } from '../../types';
import type { CardObject, CardsObject } from '../types';

export const cardSerializer = RestSerializer.extend({
  serialize(): CardResponse | CardsResponse {
    // This is how to call super, as Mirage borrows [Backbone's implementation of extend](http://backbonejs.org/#Model-extend)
    // @ts-expect-error: following docs (https://miragejs.com/api/classes/serializer/#serialize)
    const json: CardObject | CardsObject = RestSerializer.prototype.serialize.apply(
      this,
      arguments
    );

    if ('card' in json) {
      return {
        card: {
          id: Number(json.card.id),
          deckId: Number(json.card.deck),
          question: json.card.question,
          answer: json.card.answer,
          attemptCount: json.card.attemptCount,
          correctCount: json.card.correctCount,
          dateCreated: json.card.dateCreated,
        },
      };
    }

    if ('cards' in json) {
      return {
        cards: json.cards.map(
          (card): CardData => ({
            id: Number(card.id),
            deckId: Number(card.deck),
            question: card.question,
            answer: card.answer,
            attemptCount: card.attemptCount,
            correctCount: card.correctCount,
            dateCreated: card.dateCreated,
          })
        ),
      };
    }

    return json;
  },
});
