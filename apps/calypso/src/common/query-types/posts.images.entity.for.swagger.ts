import { ApiProperty } from '@nestjs/swagger';

export class PostsImagesEntityForSwagger {
  id: string;
  @ApiProperty({ type: 'string', description: 'Url image' })
  url: string;
  bucket: string;
  postId: string;
  key: string;
  width: number;
  height: number;
  fileSize: number;
  createdAt: Date;
}
