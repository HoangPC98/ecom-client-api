import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { plainToClass } from 'class-transformer';
import { OtpObjValue } from 'src/common/types/auth.type';
import { mapTimeToSecondFromStrDHM } from 'src/common/utils/time.util';
import { AppConfigService } from 'src/configs/app.config.service';
import { Session } from 'src/entities/user-entity/session.entity';

@Injectable()
export class CacheProvider {
  constructor(@Inject(CACHE_MANAGER) readonly cacheManager: Cache) {}

  private readonly TTL_DEFAULT = 60 * 60 * 1000;
  private readonly TTL_1H = 3600;
  private readonly TTL_REQC = 10 * 60;
  private readonly TTL_OTP_DF = 5 * 60 * 1000;

  protected getAccessTokenCKey = 'access_token__';
  protected sessionCkey = 'session_';
  protected otpKey = 'otp';

  async get(key: string): Promise<unknown> {
    const value = await this.cacheManager.get(key);
    const all = await this.cacheManager.store.keys();
    return value;
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    // const check = await this.cacheManager.get(key);
    // if (check) {
    //   await this.del(key);
    // }
    try {
      await this.cacheManager.set(key, value, ttl || this.TTL_DEFAULT);
    } catch (error) {
      this.throwException(`Cache ${this.set.name} error: ${key} ${value}`);
    }
  }

  async del(key: string): Promise<void> {
    const check = await this.cacheManager.get(key);
    if (check) {
      try {
        await this.cacheManager.del(key);
      } catch (error) {
        this.throwException(`An error occur when Delete Cache key: ${error}`);
      }
    } else {
      this.throwException(`Cache key: ${key} not found`);
    }
  }

  async getSession(sessionId: string, uid?: number): Promise<Session> {
    const ssFromC = await this.get(`${this.sessionCkey}${sessionId}`);
    const session = plainToClass(Session, ssFromC);
    return session;
  }

  async storeSession(session: Session) {
    await this.set(`${this.sessionCkey}${session.id}`, session);
  }

  async storeOtp(otp: OtpObjValue): Promise<void> {
    const ttl = otp.expried_in ? mapTimeToSecondFromStrDHM(otp.expried_in) : this.TTL_OTP_DF;
    await this.set(`${this.otpKey}_${otp.key}`, otp, ttl);
  }

  async getOtp(key: string): Promise<OtpObjValue> {
    const value = await this.get(`${this.otpKey}_${key}`);
    return value as OtpObjValue;
  }

  async removeOtp(key: string) {
    return await this.del(`${this.otpKey}_${key}`);
  }

  private throwException(error: string): HttpException {
    throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
