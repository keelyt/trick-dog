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

export interface CardResponse {
  card: CardData;
}

export interface CardsResponse {
  cards: CardData[];
}

export interface CardTagsResponse {
  tags: number[];
}

export interface TagData {
  id: number;
  tagName: string;
  deckId: number;
}

export interface TagResponse {
  tag: TagData;
}
export interface TagsResponse {
  tags: TagData[];
}

export interface InfiniteCardData {
  pages?: CardData[][];
  pageParams?: (string | null)[];
}

export interface CardsFilterState {
  tagId: number | null;
  search: string;
}

export interface AddCardParams {
  deckId: number;
  question: string;
  answer: string;
  tags?: number[];
}

export interface UpdateCardParams {
  cardId: number;
  deckId: number;
  question: string;
  answer: string;
  tags?: number[];
}

export interface ServerError {
  error: string;
}

export interface UserInfoData {
  email: string;
  picture: string;
}

export interface UserInfoResponse {
  userInfo: UserInfoData;
}

export interface AuthedResponse {
  authed: true;
  userInfo: UserInfoData;
}

export interface UnauthedResponse {
  authed: false;
  userInfo?: never;
}
export type AuthStatusResponse = AuthedResponse | UnauthedResponse;

// export interface GoogleCredentialPayload {
//   // The JWT's issuer (https://accounts.google.com)
//   iss?: string;
//   // Unix timestamp before which the JWT is not valid
//   nbf?: number;
//   // Your server's client ID
//   aud?: string;
//   // The unique ID of the user's Google Account
//   sub?: string;
//   // If present, the host domain of the user's GSuite email address
//   hd?: string;
//   // The user's email address
//   email?: string;
//   // true, if Google has verified the email address
//   email_verified?: boolean;
//   // The Authorized party to which the ID Token was issued
//   azp?: string;
//   // The user's full name
//   name?: string;
//   // If present, a URL to user's profile picture
//   picture?: string;
//   // The user's given name
//   given_name?: string;
//   // The user's family name
//   family_name?: string;
//   // Unix timestamp of the assertion's creation time
//   iat?: number;
//   // Unix timestamp of the assertion's expiration time
//   exp?: number;
//   // A unique JWT identifier for the token
//   jti?: string;
// }
