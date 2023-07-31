import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Jwt } from '../../../../common/jwt/jwt';
import { DevicesRepository } from '../../infrastructure/devices.repository';
import { RefreshTokenDataEntity } from '../../entities/refresh.token.data.entity';

export class SaveInfoAboutDevicesUserCommand {
  constructor(
    public refreshToken: string,
    public ip: string,
    public deviceName: string,
  ) {}
}

@CommandHandler(SaveInfoAboutDevicesUserCommand)
export class SaveInfoAboutDevicesUserUseCase
  implements ICommandHandler<SaveInfoAboutDevicesUserCommand>
{
  constructor(
    private jwtService: Jwt,
    private devicesRepository: DevicesRepository,
  ) {}

  async execute(command: SaveInfoAboutDevicesUserCommand): Promise<void> {
    const infoRefreshToken: any = await this.jwtService.getUserByRefreshToken(
      command.refreshToken,
    );

    const data = new RefreshTokenDataEntity(
      infoRefreshToken.iat,
      infoRefreshToken.exp,
      infoRefreshToken.deviceId,
      command.ip,
      command.deviceName,
      infoRefreshToken.userId,
    );

    await this.devicesRepository.saveInfoRefreshToken(data);

    await this.devicesRepository.delOldRefreshTokenData(+new Date());

    return;
  }
}
