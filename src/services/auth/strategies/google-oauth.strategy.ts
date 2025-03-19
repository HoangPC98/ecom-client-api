import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { User } from 'src/entities/user-entity/user.entity';
import { AppConfigService } from 'src/configs/app.config.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject() private configService: AppConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super({
      clientID: configService.googleOAuth.clientID,
      clientSecret: configService.googleOAuth.clientSecret,
      callbackURL: configService.googleOAuth.callbackURL,
      scope: ['profile', 'email'],
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { id, name, emails, photos } = profile;

    const user = {
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      picture: photos[0].value,
    };

    done(null, user);
  }
}
