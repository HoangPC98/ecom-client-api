import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { SignUpReq } from './dto/login.dto';
import { GetRefreshTokenResp, UserAuthJwtDto } from './dto/token.dto';
import { AuthBaseService } from './auth.base.service';
import { IGetTokenRes, ILoginResp, ISignUpRes, IUserAuth } from 'src/common/interfaces/auth.interface';
import { ErrorMessage } from 'src/common/enums/error.enum';
import { AccType, EOtpType, UsrType } from 'src/common/enums/auth.enum';
import { checkPhoneOrEmail } from 'src/common/utils/auth.util';
import { OtpObjValue } from 'src/common/types/auth.type';
import { GrpcBadRequestException, GrpcException } from 'src/common/exceptions/grpc.exception';
import { Customer } from '../../interfaces/protos/customer/customer'
import { User } from 'src/database/entities/user-entity/user.entity';

dotenv.config();

@Injectable()
export class AuthService extends AuthBaseService {
  async loginByUsr(dto: Customer.LoginT1Req): Promise<Customer.LoginT1Res> {
    const user = await this.userRepository.findOneBy({ usr: dto.usr });
    if (!user) {
      throw new GrpcBadRequestException(ErrorMessage.USER_NOT_EXIST);
    }
    await this.handleLoginCredit(user, dto.password || '');

    return {
      status: 200,
      uid: user.id,
      usr: user.usr,
      type: user.type,
      role: user.role,
      fcmToken: user.fcm_token
    };
  }

  async loginByGoogle(email: string) {
    console.log('loginByGoogle LOGIC...', email);
  }

  async googleRedirect() {
    console.log('REDIRECT LOGIC...');
  }

  async signUpByUsr(dto: Customer.SignUpT1Req): Promise<Customer.SignUpT1Res> {
    const { usr, password, inviteCode } = dto;
    const user = await this.userRepository.findOneBy({ usr: dto.usr });
    if (user) throw new GrpcBadRequestException(ErrorMessage.USR_IS_EXISTED);

    await this.checkPhoneOrEmail(usr || '', 1);
    let newUser = this.userRepository.account.create({
      usr: dto.usr,
      password: this.setPasswordHash(password || ''),
    });

    newUser = await this.userRepository.account.save(newUser);

    // const newProfile = this.userRepository.profile.create({
    //   uid: newUser.id,
    // });
    // await this.userRepository.profile.save(newProfile);
    return {
      status: 200,
      uid: newUser.id,
    };
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
