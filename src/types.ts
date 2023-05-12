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
}

export interface CardWithTagsData extends CardData {
  tags: number[];
}

export interface CardResponse {
  card: CardWithTagsData;
}

export interface CardsResponse {
  cards: CardData[];
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

export interface CardsFilterState {
  tagId: number | null;
  search: string;
}
