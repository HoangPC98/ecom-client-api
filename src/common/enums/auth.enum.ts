export enum ELoginType {
  USRPWD = 0,
  GOOGLE = 1,
  FACEBOOK = 2,
}

export enum UsrType {
  EMAIL = 'email',
  PHONE = 'phone_number',
  OAUTH = 'oauth',
}

export enum AccType {
  CLIENT = 'client',
  ADMIN = 'admin',
}

export enum ETokenType {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
}

export enum EUserReasonLockType {
  WRONG_PASSWORD_TO_MUCH = 'wrong_password_to_much',
  CHEAT = 'cheat',
  SCAM = 'scam',
}

export enum EOtpType {
  SIGN_UP = 'sign_up',
  FORGOT_PASSWORD = 'forgot_password',
  NEW_REGISTRATION = 'new_registration',
  LOGIN_NEW_DEVICE = 'login_new_device',
  CHANGE_PASSWORD = 'change_password',
  CONFIRM_TRANSACTION = 'confirm_transaction',
  SET_BIOMETRIC = 'set_biometric',
  OTHERS = 'others',
}
