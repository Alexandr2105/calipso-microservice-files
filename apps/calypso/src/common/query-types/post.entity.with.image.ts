import { PostsEntity } from '../../features/posts/entities/posts.entity';
import { ApiProperty } from '@nestjs/swagger';
import { PostsImagesEntityForSwagger } from './posts.images.entity.for.swagger';

export class PostEntityWithImage extends PostsEntity {
  @ApiProperty({ type: [PostsImagesEntityForSwagger] })
  'images': [{ url: string }];
}
