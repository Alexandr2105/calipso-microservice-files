import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { resizePhoto } from '../../../../common/helper/resize.photo';
import { FileStorageAdapterS3 } from '../../../../common/adapters/file.storage.adapter.s3';
import { AvatarsRepository } from '../../infrastructure/avatars.repository';
import { AvatarDocument } from '../../schemas/avatar.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import sharp from 'sharp';
import { settings } from '../../../../settings';

export class UploadAvatarCommand {
  constructor(public userId: string, public avatar: Buffer) {}
}

@CommandHandler(UploadAvatarCommand)
export class UploadAvatarUseCase
  implements ICommandHandler<UploadAvatarCommand>
{
  constructor(
    private fileStorageAdapter: FileStorageAdapterS3,
    private avatarsRepository: AvatarsRepository,
    @InjectModel('avatar') private avatar: Model<AvatarDocument>,
  ) {}

  async execute(command: UploadAvatarCommand): Promise<any> {
    const userAvatar: AvatarDocument =
      await this.avatarsRepository.getAvatarInfo(command.userId);
    if (userAvatar) {
      await this.fileStorageAdapter.deleteImage(
        userAvatar.bucket,
        userAvatar.key,
      );
    }
    const avatar = await resizePhoto(command.avatar);
    const infoAboutSaveAvatar = await this.fileStorageAdapter.saveAvatar(
      command.userId,
      avatar,
    );
    const avatarInfo = await sharp(avatar).metadata();

    const avatarDocument: AvatarDocument = new this.avatar();
    avatarDocument.id = infoAboutSaveAvatar.id;
    avatarDocument.url = `${settings.BASE_URL_AWS}/${settings.BACKET_NAME}/${infoAboutSaveAvatar.key}`;
    avatarDocument.bucket = infoAboutSaveAvatar.bucket;
    avatarDocument.userId = command.userId;
    avatarDocument.key = infoAboutSaveAvatar.key;
    avatarDocument.width = avatarInfo.width;
    avatarDocument.height = avatarInfo.height;
    avatarDocument.fileSize = avatarInfo.size;
    avatarDocument.createdAt = infoAboutSaveAvatar.createdAt;

    await this.avatarsRepository.saveAvatar(avatarDocument);

    return avatarDocument.url;
  }
}
