import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersProfilesDto } from '../../dto/users.profiles.dto';
import { UsersProfilesRepository } from '../../infrastructure/users.profiles.repository';
import { UsersProfilesEntity } from '../../entities/users.profiles.entity';

export class SaveInfoAboutUsersProfilesCommand {
  constructor(public profileInfo: UsersProfilesDto, public userId: string) {}
}

@CommandHandler(SaveInfoAboutUsersProfilesCommand)
export class SaveInfoAboutUsersProfilesUseCase
  implements ICommandHandler<SaveInfoAboutUsersProfilesCommand>
{
  constructor(private usersProfileRepository: UsersProfilesRepository) {}

  async execute(command: SaveInfoAboutUsersProfilesCommand): Promise<void> {
    const profile: UsersProfilesEntity = {
      userId: command.userId,
      ...command.profileInfo,
    };
    await this.usersProfileRepository.saveUsersProfiles(profile);
  }
}
