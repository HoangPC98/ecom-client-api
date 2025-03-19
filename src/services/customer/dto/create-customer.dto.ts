import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { EUserType } from 'src/common/enums/user.enum';

export class CreateCustomerBaseDto {
  @IsNotEmpty()
  @ApiProperty({
    example: '0987654321',
  })
  phoneNumber: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
  })
  password: string;

  @IsOptional()
  sourceId: string = EUserType.PERSONAL;
}

export class CreateCustomerDto extends CreateCustomerBaseDto {}
