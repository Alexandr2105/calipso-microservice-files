import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma-service';
import { PostsEntity } from '../entities/posts.entity';

@Injectable()
export class PostsRepository {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async createNewPost(post: PostsEntity): Promise<PostsEntity> {
    return this.prisma.post.create({ data: post });
  }

  async getPostById(postId: string): Promise<PostsEntity> {
    return this.prisma.post.findUnique({ where: { id: postId } });
  }

  async updateDescription(description: string, postId: string) {
    await this.prisma.post.update({
      where: { id: postId },
      data: { description: description },
    });
  }

  async deletePost(postId: string) {
    await this.prisma.post.delete({
      where: { id: postId },
    });
  }
}
