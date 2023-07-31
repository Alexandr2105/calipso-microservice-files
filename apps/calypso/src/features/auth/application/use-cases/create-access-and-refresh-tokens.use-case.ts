import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Jwt } from '../../../../common/jwt/jwt';
import { UsersProfilesRepository } from '../../../users-profiles/infrastructure/users.profiles.repository';

export class CreateAccessAndRefreshTokensCommand {
  constructor(public userId: string, public deviceId: string) {}
}
@CommandHandler(CreateAccessAndRefreshTokensCommand)
export class CreateAccessAndRefreshTokensUseCase
  implements ICommandHandler<CreateAccessAndRefreshTokensCommand>
{
  constructor(
    private jwtService: Jwt,
    private profileRepo: UsersProfilesRepository,
  ) {}

  async execute(command: CreateAccessAndRefreshTokensCommand): Promise<object> {
    const accessToken = this.jwtService.creatJWT(command.userId);
    const refreshToken = this.jwtService.creatRefreshJWT(
      command.userId,
      command.deviceId,
    );
    const profile = await this.profileRepo.getProfile(command.userId);

    return { accessToken, refreshToken, info: profile !== null };
  }
}
