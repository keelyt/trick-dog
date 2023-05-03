export interface DeckData {
  id: number;
  deck_name: string;
  card_count: number;
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
  deck_id: number;
  question: string;
  answer: string;
  attempt_count: number;
  correct_count: number;
  date_created: string;
}

export interface CardResponse {
  card: CardData;
}

export interface CardsResponse {
  cards: CardData[];
}

export interface TagData {
  id: number;
  tag_name: string;
  deck_id: number;
}

export interface TagsResponse {
  tags: TagData[];
}

export interface ServerError {
  error: string;
}
