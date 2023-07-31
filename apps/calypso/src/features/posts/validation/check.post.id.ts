import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts.repository';

@ValidatorConstraint({ name: 'checkPostId', async: true })
@Injectable()
export class CheckPostId implements ValidatorConstraintInterface {
  constructor(private postsRepository: PostsRepository) {}

  async validate(postId: string) {
    const post = await this.postsRepository.getPostById(postId);
    if (!post) {
      throw new NotFoundException();
    } else {
      return true;
    }
  }
}
