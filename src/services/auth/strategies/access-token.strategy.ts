import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as dotenv from 'dotenv';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { AppConfigService } from 'src/configs/app.config.service';
import { IClientJwtPayload, IUserAuth } from 'src/common/interfaces/auth.interface';
import { TOKEN_TYPE } from 'src/common/enums/index.enum';

dotenv.config();

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, TOKEN_TYPE.ACCESS_TOKEN) {
  constructor(
    private configService: AppConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtAccessTokenSecret,
    });
  }

  async validate(payload: IClientJwtPayload): Promise<IClientJwtPayload> {
    const { uid, sid, active, device_id }: IUserAuth = payload;
    const user = { ...payload };
    return user;
  }
}
