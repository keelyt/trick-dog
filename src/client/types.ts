export interface DeckData {
  id: number;
  deck_name: string;
  card_count: number;
}

export interface CardData {
  id: number;
  deck_id: number;
  question: string;
  answer: string;
  attempt_count: number;
  correct_count: number;
  date_created: string;
  tags?: TagData[];
}

export interface TagData {
  id: number;
  tag_name: string;
}

export interface ServerError {
  error: string;
}

export interface CardsFetchParams {
  signal?: AbortSignal;
  deckId?: number;
  before?: string;
}
