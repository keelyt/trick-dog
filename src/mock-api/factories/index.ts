import { cardFactory } from './cardFactory';
import { deckFactory } from './deckFactory';
import { tagFactory } from './tagFactory';

export const factories = {
  deck: deckFactory,
  card: cardFactory,
  tag: tagFactory,
};
