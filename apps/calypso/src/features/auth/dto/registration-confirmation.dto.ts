import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { CheckConfirmationCode } from '../validation/check-confirmation-code';

export class RegistrationConformationDto {
  @Transform(({ value }) => String(value).trim())
  @ApiProperty({ type: 'string' })
  @Validate(CheckConfirmationCode)
  code: string;
}
