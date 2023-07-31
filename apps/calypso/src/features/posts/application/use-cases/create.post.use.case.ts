import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { randomUUID } from 'crypto';

export class CreatePostCommand {
  constructor(public description: string, public userId: string) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(private postsRepository: PostsRepository) {}

  async execute(command: CreatePostCommand) {
    return await this.postsRepository.createNewPost({
      id: randomUUID(),
      userId: command.userId,
      description: command.description,
      createdAt: new Date(),
    });
  }
}
