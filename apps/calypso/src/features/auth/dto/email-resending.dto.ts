import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailResendingDto {
  @Transform(({ value }) => String(value).trim())
  @IsEmail({}, { message: 'Invalid email' })
  @ApiProperty({ type: 'string' })
  email: string;
}
