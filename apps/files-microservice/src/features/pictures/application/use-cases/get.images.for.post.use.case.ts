import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ImagesRepository } from '../../infrastructure/images.repository';
import { PostImagesDocument } from '../../schemas/post.images.schema';

export class GetImagesForPostCommand {
  constructor(public postId: string) {}
}

@CommandHandler(GetImagesForPostCommand)
export class GetImagesForPostUseCase
  implements ICommandHandler<GetImagesForPostCommand>
{
  constructor(private imagesRepository: ImagesRepository) {}

  async execute(command: GetImagesForPostCommand): Promise<any> {
    const postImagesInfo: PostImagesDocument[] =
      await this.imagesRepository.getImages(command.postId);
    const imageUrl = [];
    for (const imageInfo of postImagesInfo) {
      imageUrl.push({ url: imageInfo.url });
    }
    return imageUrl;
  }
}
