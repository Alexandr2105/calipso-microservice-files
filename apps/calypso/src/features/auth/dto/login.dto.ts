import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ type: 'string' })
  loginOrEmail: string;
  @ApiProperty({ type: 'string' })
  password: string;
}
