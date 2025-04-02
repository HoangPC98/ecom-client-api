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
  usr: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
  })
  password: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
  })
  invite_code: string;
}

// export class SignUpByUsrReq extends SignUpReq {
//   @IsOptional()
//   @ApiProperty({
//     example: '0987654321',
//   })
//   usr: string;

//   @IsOptional()
//   @ApiProperty({
//     example: 'abc123@gmail.com',
//   })
//   email: string;
// }
