import type { UserInfoData } from '../types';
import type { TokenPayload } from 'google-auth-library';

export interface ResLocals {
  userId?: string;
}

export interface ReqBodyLogin {
  credential: google.accounts.id.CredentialResponse['credential'];
}

export interface ResLocalsLogin extends ResLocals {
  googlePayload?: TokenPayload;
  userInfo?: UserInfoData;
}
