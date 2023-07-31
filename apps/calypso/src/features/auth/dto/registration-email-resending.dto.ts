import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrationEmailResendingDto {
  @IsEmail({}, { message: 'Invalid email' })
  @ApiProperty({ type: 'string' })
  email: string;
}
