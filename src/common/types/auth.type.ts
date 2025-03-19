import { EUserReasonLockType } from '../enums/auth.enum';
import { EUserActive } from '../enums/user.enum';

export type SessionCachePL = {
  uid: string;
  deviceId: string;
  refreshToken: string;
  fcmToken: string;
  lastUsedAt: string;
  deviceInfo?: string;
};

export type UserState = {
  isLock: boolean;
  isTempLock: boolean;
  isNewCustomer: boolean;
  reasonLockType?: EUserReasonLockType;
  reasonLockDesc?: string;
  lockAt?: Date;
};

export type UserAuthJwtPayload = {
  uid: number | string;
  sid: string;
  active: EUserActive;
  state?: UserState;
  lastLoginAt?: string | Date;
  email?: string;
  phone?: string;
};

export type PhoneOrEmail = 'phone' | 'email';

export type OtpObjValue = {
  id: string;
  value?: string;
  key?: string;
  type?: string;
  wrong_count?: number;
  expried_in?: string;
};

export type GoogleOAuthCredential = {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  scope: string[];
};
