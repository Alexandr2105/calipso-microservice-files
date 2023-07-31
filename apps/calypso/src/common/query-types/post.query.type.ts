import { ApiProperty } from '@nestjs/swagger';
import { PostEntityWithImage } from './post.entity.with.image';

export class PostQueryType {
  @ApiProperty({ type: 'number', description: 'Number of items sorted' })
  'pagesCount': number;
  @ApiProperty({ type: 'number', description: 'Number of pages' })
  'page': number;
  @ApiProperty({ type: 'number', description: 'Page Size' })
  'pageSize': number;
  @ApiProperty({ type: 'number', description: 'Total items' })
  'totalCount': number;
  @ApiProperty({ type: [PostEntityWithImage] })
  'items': PostEntityWithImage[];
}
