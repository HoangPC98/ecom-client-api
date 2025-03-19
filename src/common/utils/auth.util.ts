import { UsrType } from '../enums/auth.enum';

export const checkPhoneOrEmail = (usr: string) => {
  const isPhoneNumber =
    usr.match(new RegExp('^[0-9]*$')) && ((usr[0] == '+' && usr.length) == 12 || (usr[0] == '0' && usr.length == 10));
  if (isPhoneNumber) return UsrType.PHONE;
  else if (usr.includes('@')) return UsrType.EMAIL;
  else return UsrType.OAUTH;
};
