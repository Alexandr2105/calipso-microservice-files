import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersProfilesRepository } from '../../infrastructure/users.profiles.repository';
import { UsersProfilesEntity } from '../../entities/users.profiles.entity';

export class GetUserProfileCommand {
  constructor(public userId: string) {}
}

@CommandHandler(GetUserProfileCommand)
export class GetUserProfileUseCase
  implements ICommandHandler<GetUserProfileCommand>
{
  constructor(private userProfile: UsersProfilesRepository) {}

  async execute(command: GetUserProfileCommand): Promise<UsersProfilesEntity> {
    return this.userProfile.getProfile(command.userId);
  }
}
