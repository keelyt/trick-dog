export interface DeckData {
  id: number;
  deck_name: string;
  card_count: number;
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
}

export type ServerResponse = CardResponse | CardsResponse | DeckResponse | DecksResponse;
export type ServerData = CardData | CardData[] | DeckData | DeckData[];

export interface ServerError {
  error: string;
}
