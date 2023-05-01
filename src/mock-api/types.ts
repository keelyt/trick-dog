import type { models } from './models';
import type { Registry } from 'miragejs';
import type Schema from 'miragejs/orm/schema';

// eslint-disable-next-line @typescript-eslint/ban-types
type AppRegistry = Registry<typeof models, {}>;
export type AppSchema = Schema<AppRegistry>;

export interface Card {
  id: string;
  deckId?: string;
  deck?: string;
  question: string;
  answer: string;
  attemptCount: number;
  correctCount: number;
  dateCreated: string;
  tags: Tag[];
  tagIds: string[];
}

export interface CardObject {
  card: Card;
}

export interface CardsObject {
  cards: Card[];
}

export interface Deck {
  id: string;
  deckName: string;
  cards: Card[];
  cardIds: string[];
  tags: Tag[];
  tagIds: string[];
}

export interface DeckObject {
  deck: Deck;
}

export interface DecksObject {
  decks: Deck[];
}

export interface Tag {
  id: string;
  tagName: string;
  deckId: string;
  cards: Card[];
  cardIds: string[];
}

export interface TagsObject {
  tags: Tag[];
}
