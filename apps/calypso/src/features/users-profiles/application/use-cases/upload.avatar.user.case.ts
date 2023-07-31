import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersProfilesRepository } from '../../infrastructure/users.profiles.repository';

export class UploadAvatarCommand {
  constructor(
    public userId: string,
    public userLogin: string,
    public url: string,
  ) {}
}

@CommandHandler(UploadAvatarCommand)
export class UploadAvatarUseCase
  implements ICommandHandler<UploadAvatarCommand>
{
  constructor(private profilesRepository: UsersProfilesRepository) {}

  async execute(command: UploadAvatarCommand): Promise<any> {
    await this.profilesRepository.saveUsersProfiles({
      userId: command.userId,
      login: command.userLogin,
      photo: command.url,
    });
  }
}
