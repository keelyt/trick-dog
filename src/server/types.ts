import type { UserInfoData } from '../types';
import type { TokenPayload } from 'google-auth-library';

export interface ReqBodyLogin {
  credential: google.accounts.id.CredentialResponse['credential'];
}

export interface ResLocalsLogin {
  googlePayload?: TokenPayload;
  userInfo: UserInfoData;
}
