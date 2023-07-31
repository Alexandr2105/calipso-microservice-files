import { Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DescriptionDto {
  @Transform(({ value }) => String(value).trim())
  @Length(0, 500, { message: 'Wrong length' })
  @ApiProperty({
    type: 'string',
    maximum: 500,
  })
  description: string;
}
