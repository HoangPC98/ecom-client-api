import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { EUserType } from 'src/common/enums/user.enum';

export class LoginByUsrPwdReq {
  @IsNotEmpty()
  @ApiProperty()
  @Transform((s) => s.value.trim())
  usr: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

export class LoginByGoogleReq {
  @IsNotEmpty()
  @ApiProperty()
  @Transform((s) => s.value.trim())
  email: string;
}
export class SignUpReq {
  @IsNotEmpty()
  @ApiProperty({
    example: '0123456789',
  })
  phoneOrEmail: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
  })
  password: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
  })
  otpCode: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'e570afd9-3f01-4461-84eb-46c2c17e8f',
  })
  otpId: string;
}

export class SignUpByUsrReq extends SignUpReq {
  @IsOptional()
  @ApiProperty({
    example: '0987654321',
  })
  phoneNumber: string;

  @IsOptional()
  @ApiProperty({
    example: 'abc123@gmail.com',
  })
  email: string;
}
