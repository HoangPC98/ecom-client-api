import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetRefreshTokenReq {
  @IsNotEmpty()
  @ApiProperty()
  refreshToken: string;
}

export class GetRefreshTokenResp {
  accessToken: string;
  refreshToken: string;
}

export type UserAuthJwtDto = {
  uid: string;
  state: string;
  email: string;
  phone: string;
};
