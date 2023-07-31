import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { ForbiddenException } from '@nestjs/common';

export class DeletePostCommand {
  constructor(public postId: string, public userId: string) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(private postsRepository: PostsRepository) {}

  async execute(command: DeletePostCommand): Promise<any> {
    const post = await this.postsRepository.getPostById(command.postId);
    if (post && post.userId !== command.userId) throw new ForbiddenException();
    await this.postsRepository.deletePost(command.postId);
  }
}
