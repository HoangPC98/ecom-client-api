import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as dotEnv from 'dotenv';
import * as otpGenerator from 'otp-generator';
import { ErrorMessage } from 'src/common/enums/error.enum';
import { IOtpTracking } from 'src/common/interfaces/auth.interface';
import { OtpObjValue, PhoneOrEmail } from 'src/common/types/auth.type';
import { v4 as uuidv4 } from 'uuid';
import { CacheProvider } from '../cache/cache.provider';
import { EOtpType } from 'src/common/enums/auth.enum';

dotEnv.config();

@Injectable()
export class OtpProvider {
  // Thời gian OTP hết hiệu lực
  private readonly otpExpireTime = process.env.OTP_EXPIRE_TIME;
  private readonly otpByPassAll: string = process.env.OTP_BY_PASS_ALL;
  private readonly otpCodeBypassDf: string = process.env.OTP_CODE_BYPASS_DF || null;
  private readonly otpWrongCountLitmit: number = Number.parseInt(process.env.OTP_WRONG_COUNT_LIMIT);

  // Thời gian OTP được lưu trữ lại để kiểm tra

  constructor(private cacheProvider: CacheProvider) {}

  public async validate(phoneOrEmail: string, otp: string, trackingId: string): Promise<boolean> {
    const otpByPassKey = process.env.OTP_BY_PASS_KEY;

    if (this.otpCodeBypassDf != null && otp == this.otpCodeBypassDf) return true;
    if (this.otpByPassAll.toString().toLowerCase() === 'true') return true;
    if (otpByPassKey?.includes(phoneOrEmail)) return true;

    const cacheOtp = await this.cacheProvider.getOtp(phoneOrEmail);

    if (!cacheOtp) {
      throw new BadRequestException(ErrorMessage.OTP_EXPIRED);
    }

    if (cacheOtp.wrong_count && cacheOtp.wrong_count >= this.otpWrongCountLitmit)
      throw new BadRequestException(ErrorMessage.WRONG_OTP_TO_MUCH);

    if (otp == cacheOtp.value && trackingId == cacheOtp.id) {
      await this.cacheProvider.removeOtp(cacheOtp.key);
      return true;
    } else {
      cacheOtp.wrong_count = cacheOtp.wrong_count ? (cacheOtp.wrong_count += 1) : 1;
      await this.cacheProvider.storeOtp(cacheOtp);
      throw new BadRequestException(ErrorMessage.INVALID_OTP_CODE);
    }
  }

  // key = phoneNumber or email
  public async generateOtpCode(phoneOrEmail: string, type?: EOtpType): Promise<OtpObjValue> {
    const otpCode = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const otpValue: OtpObjValue = {
      id: uuidv4(),
      value: otpCode,
      key: phoneOrEmail,
      type: type,
      expried_in: '3m',
    };
    await this.cacheProvider.storeOtp(otpValue);
    const otp = await this.cacheProvider.getOtp(phoneOrEmail);
    return otp;
  }
}
