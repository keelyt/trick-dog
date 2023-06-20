import type {
  CardResponse,
  CardsResponse,
  DeckPatchResponse,
  DeckResponse,
  DecksResponse,
  TagsResponse,
  UserInfoData,
  UserInfoResponse,
} from '../types';
import type { TokenPayload } from 'google-auth-library';

export interface ReqParamsDeck {
  deckId: string;
}

export type ReqParamsCard = ReqParamsDeck & { cardId: string };
export type ReqParamsTag = ReqParamsDeck & { tagId: string };

export interface ReqBodyLogin {
  credential: google.accounts.id.CredentialResponse['credential'];
}

export interface ReqBodyCard {
  question: string;
  answer: string;
  tags?: number[];
}

export interface ReqBodyDeck {
  deckName?: string;
}

export interface ReqQueryCards {
  before?: string;
  tag?: string;
  q?: string;
  limit: string;
}

export interface ResLocals {
  userId?: number;
}

export interface ResLocalsAuth {
  userId: number;
}

export interface ResLocalsLogin extends ResLocals {
  googlePayload?: TokenPayload;
  userInfo?: UserInfoData;
}

export type ResLocalsCard = ResLocalsAuth & CardResponse;
export type ResLocalsCards = ResLocalsAuth & CardsResponse;
export type ResLocalsDeck = ResLocalsAuth & DeckResponse;
export type ResLocalsDeckPatch = ResLocalsAuth & DeckPatchResponse;
export type ResLocalsDecks = ResLocalsAuth & DecksResponse;
export type ResLocalsStatus = ResLocalsAuth & UserInfoResponse;
export type ResLocalsTags = ResLocalsAuth & TagsResponse;
