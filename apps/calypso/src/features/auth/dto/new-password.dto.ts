import { Transform } from 'class-transformer';
import { Length, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  maxLengthPassword,
  minLengthPassword,
} from '../../../common/constants/models.constants';
import { CheckConfirmationCode } from '../validation/check-confirmation-code';

export class NewPasswordDto {
  @Transform(({ value }) => String(value).trim())
  @ApiProperty({
    type: 'string',
    minimum: minLengthPassword,
    maximum: maxLengthPassword,
  })
  @Length(minLengthPassword, maxLengthPassword, {
    message: 'Wrong length',
  })
  newPassword: string;

  @Transform(({ value }) => String(value).trim())
  @ApiProperty({ type: 'string' })
  @Validate(CheckConfirmationCode)
  recoveryCode: string;
}
