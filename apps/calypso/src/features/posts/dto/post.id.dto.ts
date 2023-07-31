import { Validate } from 'class-validator';
import { CheckPostId } from '../validation/check.post.id';
import { ApiProperty } from '@nestjs/swagger';

export class PostIdDto {
  @Validate(CheckPostId)
  @ApiProperty({ type: 'string' })
  postId: string;
}
