import { Model, belongsTo, hasMany } from 'miragejs';

import type { Card, Deck, Tag } from '../types';
import type { ModelDefinition } from 'miragejs/-types';

const CardModel: ModelDefinition<Card> = Model.extend({
  deck: belongsTo(),
  tags: hasMany(),
});
const DeckModel: ModelDefinition<Deck> = Model.extend({ cards: hasMany(), tags: hasMany() });
const TagModel: ModelDefinition<Tag> = Model.extend({ cards: hasMany(), deck: belongsTo() });

export const models = {
  card: CardModel,
  deck: DeckModel,
  tag: TagModel,
};
