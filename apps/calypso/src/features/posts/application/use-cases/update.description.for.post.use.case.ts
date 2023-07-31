import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { ForbiddenException } from '@nestjs/common';

export class UpdateDescriptionForPostCommand {
  constructor(
    public description: string,
    public postId: string,
    public userId: string,
  ) {}
}

@CommandHandler(UpdateDescriptionForPostCommand)
export class UpdateDescriptionForPostUseCase
  implements ICommandHandler<UpdateDescriptionForPostCommand>
{
  constructor(private postsRepository: PostsRepository) {}

  async execute(command: UpdateDescriptionForPostCommand): Promise<void> {
    const post = await this.postsRepository.getPostById(command.postId);
    if (post.userId !== command.userId) throw new ForbiddenException();
    await this.postsRepository.updateDescription(
      command.description,
      command.postId,
    );
  }
}
