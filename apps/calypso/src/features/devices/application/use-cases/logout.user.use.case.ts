import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesRepository } from '../../infrastructure/devices.repository';

export class LogoutUserCommand {
  constructor(public deviceId: string) {}
}

@CommandHandler(LogoutUserCommand)
export class LogoutUserUseCase implements ICommandHandler<LogoutUserCommand> {
  constructor(private devicesRepository: DevicesRepository) {}

  async execute(command: LogoutUserCommand) {
    return await this.devicesRepository.delDevice(command.deviceId);
  }
}
