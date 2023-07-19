import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ImagesRepository } from '../../infrastructure/images.repository';
import { FileStorageAdapterS3 } from '../../../../common/adapters/file.storage.adapter.s3';
import { PostImagesDocument } from '../../schemas/post.images.schema';

export class DeletePostImagesCommand {
  constructor(public postId: string) {}
}

@CommandHandler(DeletePostImagesCommand)
export class DeletePostImagesUseCase
  implements ICommandHandler<DeletePostImagesCommand>
{
  constructor(
    private imagesRepository: ImagesRepository,
    private fileStorage: FileStorageAdapterS3,
  ) {}

  async execute(command: DeletePostImagesCommand): Promise<any> {
    const images: PostImagesDocument[] = await this.imagesRepository.getImages(
      command.postId,
    );
    await this.imagesRepository.deleteImages(command.postId);
    for (const image of images) {
      await this.fileStorage.deleteImage(image.bucket, image.key);
    }
  }
}
