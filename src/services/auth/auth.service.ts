import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { SignUpReq } from './dto/login.dto';
import { GetRefreshTokenResp, UserAuthJwtDto } from './dto/token.dto';
import { AuthBaseService } from './auth.base.service';
import { IGetTokenRes, ILoginResp, IUserAuth } from 'src/common/interfaces/auth.interface';
import { ErrorMessage } from 'src/common/enums/error.enum';
import { AccType, EOtpType, UsrType } from 'src/common/enums/auth.enum';
import { checkPhoneOrEmail } from 'src/common/utils/auth.util';
import { OtpObjValue } from 'src/common/types/auth.type';
import amqp, { Channel, Connection } from "amqplib";
import { rabbitmqUri } from 'src/providers/queue';

dotenv.config();

@Injectable()
export class AuthService extends AuthBaseService {
 
  async loginByUsr(usr: string, password: string, deviceId?: string): Promise<ILoginResp> {
    const user = await this.userRepository.findOneBy({ usr });
    if (!user) throw new BadRequestException(ErrorMessage.USER_NOT_EXIST);
    await this.handleLoginCredit(user, password);
    let tokens: IGetTokenRes;
    let checkSession = await this.userRepository.session.findOne({
      where: { device_id: deviceId },
    });
    if (!checkSession) {
      const sid = this.generateNewSid();
      tokens = await this.getClientTokens(user, sid);
      checkSession = await this.createNewSession(user.id, sid, tokens.refreshToken, deviceId);
    } else {
      tokens = await this.getClientTokens(user, checkSession.id);
    }

    return {
      ...tokens,
      sid: checkSession.id,
      accType: AccType.CLIENT,
    };
  }

  async loginByGoogle(email: string) {
    console.log('loginByGoogle LOGIC...', email);
  }

  async googleRedirect() {
    console.log('REDIRECT LOGIC...');
  }

  async signUpByUsr(dto: SignUpReq) {
    const { phoneOrEmail, otpCode, password, otpId } = dto;
    const user = await this.userRepository.findOneBy({ usr: dto.phoneOrEmail });
    if (user) throw new BadRequestException(ErrorMessage.USR_IS_EXISTED);
    await this.otpProvider.validate(phoneOrEmail, otpCode, otpId);

    await this.checkPhoneOrEmail(dto.phoneOrEmail, 1);
    let newUser = this.userRepository.account.create({
      usr: dto.phoneOrEmail,
      password: this.setPasswordHash(dto.password),
    });

    newUser = await this.userRepository.account.save(newUser);

    const newProfile = this.userRepository.profile.create({
      uid: newUser.id,
    });
    await this.userRepository.profile.save(newProfile);
    return;
  }

  async getRefreshToken(refreshToken: string): Promise<GetRefreshTokenResp> {
    try {
      const userValidated = await this.jwtService.verify(refreshToken, {
        secret: this.appConfigService.jwtRefreshTokenSecret,
      });
      const tokens = await this.getClientTokens(userValidated, userValidated.sid);
      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid Token');
    }
  }

  async logout(user: IUserAuth) {
    await this.expriedSession(user.sid);
  }

  async checkPhoneOrEmail(usr: string, forSignUp: any): Promise<any> {
    const userByUsr = await this.userRepository.findOneBy({ usr });
    if (userByUsr) {
      if (forSignUp) throw new BadRequestException(ErrorMessage.USR_IS_EXISTED);
    }
    return {
      isSignUp: false,
      isLock: false,
      loginNewDevice: false,
    };
  }

  async sendOtp(usr: string, type: EOtpType) {
    const userType = checkPhoneOrEmail(usr);
    let otpSend: OtpObjValue;
    let msg = usr;

    // this.channel.sendToQueue(
    //   'MESSSAGE_SERVICE_QUEUE',
    //   Buffer.from(JSON.stringify({ msg })),
    //   {
    //     persistent: true  // make sure msg won't be lost even RMQ restart (RMQ will save msg to disk in advanced)
    //   }
    // );
    if (userType == UsrType.EMAIL) {
      return await this.sendOtpByEmail(usr, type);
    } else {
      otpSend = await this.sendOtpBySms(usr, type);
      return otpSend;
    }
  }

  async checkOtp(phoneOrEmail: string, value: string, id: string) {
    const validate = await this.otpProvider.validate(phoneOrEmail, value, id);
    return validate;
  }
}
