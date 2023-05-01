import CardSerializer from './card';
import DeckSerializer from './deck';
import TagSerializer from './tag';

export const serializers = {
  deck: DeckSerializer,
  card: CardSerializer,
  tag: TagSerializer,
};
