import { cardSerializer } from './cardSerializer';
import { deckSerializer } from './deckSerializer';
import { tagSerializer } from './tagSerializer';

export const serializers = {
  deck: deckSerializer,
  card: cardSerializer,
  tag: tagSerializer,
};
