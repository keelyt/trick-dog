import { RestSerializer } from 'miragejs';

import type { DeckResponse, DecksResponse } from '../../types';
import type { DeckObject, DecksObject } from '../types';

export default class DeckSerializer extends RestSerializer {
  serialize(): DeckResponse | DecksResponse {
    // This is how to call super, as Mirage borrows [Backbone's implementation of extend](http://backbonejs.org/#Model-extend)
    const json: DeckObject | DecksObject = RestSerializer.prototype.serialize.apply(
      this,
      arguments
    );

    if ('deck' in json) {
      return {
        deck: {
          id: Number(json.deck.id),
          deck_name: json.deck.deckName,
          card_count: json.deck.cards.length,
        },
      };
    }

    if ('decks' in json) {
      return {
        decks: json.decks
          .sort((a, b) => {
            if (a.deckName > b.deckName) return 1;
            if (b.deckName > a.deckName) return -1;
            return 0;
          })
          .map((deck) => ({
            id: Number(deck.id),
            deck_name: deck.deckName,
            card_count: deck.cards.length,
          })),
      };
    }

    return json;
  }
}
