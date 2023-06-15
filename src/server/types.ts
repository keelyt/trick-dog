import type { DeckResponse, DecksResponse, UserInfoData, UserInfoResponse } from '../types';
import type { TokenPayload } from 'google-auth-library';

export interface ReqParamsDeck {
  deckId: string;
}

export type ReqParamsCard = ReqParamsDeck & { cardId: string };
export type ReqParamsTag = ReqParamsDeck & { tagId: string };

export interface ReqBodyLogin {
  credential: google.accounts.id.CredentialResponse['credential'];
}

export interface ReqBodyDeckPost {
  deckName?: string;
}

export interface ResLocals {
  userId?: string;
}

export interface ResLocalsLogin extends ResLocals {
  googlePayload?: TokenPayload;
  userInfo?: UserInfoData;
}

export type ResLocalsDeck = ResLocals & DeckResponse;
export type ResLocalsDecks = ResLocals & DecksResponse;
export type ResLocalsStatus = ResLocals & UserInfoResponse;
