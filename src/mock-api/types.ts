import type { models } from './models';
import type { Registry, Server } from 'miragejs';
import type Schema from 'miragejs/orm/schema';

// eslint-disable-next-line @typescript-eslint/ban-types
export type AppRegistry = Registry<typeof models, {}>;
export type AppServer = Server<AppRegistry>;
export type AppSchema = Schema<AppRegistry>;

export interface Card {
  id: string;
  deck: Deck;
  deckId: string;
  question: string;
  answer: string;
  attemptCount: number;
  correctCount: number;
  dateCreated: string;
  tags: Tag[];
  tagIds: string[];
}

export interface CardObject {
  card: {
    id: string;
    deck: string;
    question: string;
    answer: string;
    attemptCount: number;
    correctCount: number;
    dateCreated: string;
    tags: string[];
  };
}

export interface CardsObject {
  cards: {
    id: string;
    deck: string;
    question: string;
    answer: string;
    attemptCount: number;
    correctCount: number;
    dateCreated: string;
    tags: string[];
  }[];
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
  deck: {
    id: string;
    deckName: string;
    cards: string[];
    tags: Tag[];
  };
}

export interface DecksObject {
  decks: {
    id: string;
    deckName: string;
    cards: string[];
    tags: Tag[];
  }[];
}

export interface Tag {
  id: string;
  tagName: string;
  deck: Deck;
  deckId: string;
  cards: Card[];
  cardIds: string[];
}

export interface TagObject {
  tag: {
    id: string;
    tagName: string;
    deck: string;
    cards: string[];
  };
}

export interface TagsObject {
  tags: {
    id: string;
    tagName: string;
    deck: string;
    cards: string[];
  }[];
}
