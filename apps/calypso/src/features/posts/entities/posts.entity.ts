import { ApiProperty } from '@nestjs/swagger';

export class PostsEntity {
  @ApiProperty({ type: 'string', description: 'Post id' })
  id: string;
  @ApiProperty({ type: 'string', description: 'UserId' })
  userId: string;
  @ApiProperty({ type: 'string', description: 'Description post' })
  description?: string;
  @ApiProperty({ type: 'string', description: 'Created Date' })
  createdAt: Date;

  constructor(
    id: string,
    userId: string,
    description: string,
    createdAt: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.description = description;
    this.createdAt = createdAt;
  }
}
