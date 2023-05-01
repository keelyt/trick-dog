import { Model, belongsTo, hasMany } from 'miragejs';

import type { Card, Deck, Tag } from '../types';
import type { ModelDefinition } from 'miragejs/-types';

const CardModel: ModelDefinition<Card> = Model.extend({
  deck: belongsTo(),
  tags: hasMany(),
});
const DeckModel: ModelDefinition<Deck> = Model.extend({ cards: hasMany() });
const TagModel: ModelDefinition<Tag> = Model.extend({ cards: hasMany() });

export const models = {
  // cardTag: CardTagModel,
  card: CardModel,
  deck: DeckModel,
  tag: TagModel,
};
