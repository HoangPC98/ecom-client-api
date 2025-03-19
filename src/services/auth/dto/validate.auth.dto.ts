import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { EOtpType } from 'src/common/enums/auth.enum';

export class ICheckPhoneOrEmailReq {
  @IsNotEmpty()
  @ApiProperty()
  usr: string;

  @IsOptional()
  deviceId?: string;

  @IsOptional()
  forSignUp?: boolean;
}

export class GetOtpReq {
  @IsNotEmpty()
  @ApiProperty()
  @Transform((s) => s.value.trim())
  usr: string;

  @IsOptional()
  @ApiProperty()
  @IsEnum({ enum: EOtpType })
  otpType: EOtpType;
}
