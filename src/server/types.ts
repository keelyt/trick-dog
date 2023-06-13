import type { DecksResponse, UserInfoData, UserInfoResponse } from '../types';
import type { TokenPayload } from 'google-auth-library';

export interface ReqBodyLogin {
  credential: google.accounts.id.CredentialResponse['credential'];
}

export interface ResLocals {
  userId?: string;
}

export interface ResLocalsLogin extends ResLocals {
  googlePayload?: TokenPayload;
  userInfo?: UserInfoData;
}

export type ResLocalsDecks = ResLocals & DecksResponse;
export type ResLocalsStatus = ResLocals & UserInfoResponse;
