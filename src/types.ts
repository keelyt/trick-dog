export interface DeckData {
  id: number;
  deckName: string;
  cardCount: number;
  tags: TagData[];
}

export interface DeckResponse {
  deck: DeckData;
}

export interface DecksResponse {
  decks: DeckData[];
}

export interface CardData {
  id: number;
  deckId: number;
  question: string;
  answer: string;
  attemptCount: number;
  correctCount: number;
  dateCreated: string;
  tags?: number[];
}

export interface CardResponse {
  card: CardData;
}

export interface CardsResponse {
  cards: Omit<CardData, 'tags'>[];
}

export interface TagData {
  id: number;
  tagName: string;
  deckId: number;
}

export interface TagsResponse {
  tags: TagData[];
}

export interface ServerError {
  error: string;
}

export interface InfiniteCardData {
  pages?: CardData[][];
  pageParams?: (string | null)[];
}
