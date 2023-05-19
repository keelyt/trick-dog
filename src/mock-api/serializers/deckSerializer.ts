import { RestSerializer } from 'miragejs';

import type { DeckData, DeckResponse, DecksResponse, TagData } from '../../types';
import type { DeckObject, DecksObject } from '../types';

export const deckSerializer = RestSerializer.extend({
  include: ['tags', 'cards'],
  embed: true,
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
          deckName: json.deck.deckName,
          cardCount: json.deck.cards.length,
          tags: json.deck.tags
            .map(
              (tag): TagData => ({
                id: Number(tag.id),
                tagName: tag.tagName,
                deckId: Number(tag.deck),
              })
            )
            .sort((a, b) => {
              if (a.tagName.toLowerCase() > b.tagName.toLowerCase()) return 1;
              if (b.tagName.toLowerCase() > a.tagName.toLowerCase()) return -1;
              return 0;
            }),
        },
      };
    }

    if ('decks' in json) {
      return {
        decks: json.decks.map(
          (deck): DeckData => ({
            id: Number(deck.id),
            deckName: deck.deckName,
            cardCount: deck.cards.length,
            tags: deck.tags
              .map(
                (tag): TagData => ({
                  id: Number(tag.id),
                  tagName: tag.tagName,
                  deckId: Number(tag.deck),
                })
              )
              .sort((a, b) => {
                if (a.tagName.toLowerCase() > b.tagName.toLowerCase()) return 1;
                if (b.tagName.toLowerCase() > a.tagName.toLowerCase()) return -1;
                return 0;
              }),
          })
        ),
      };
    }

    return json;
  },
});
