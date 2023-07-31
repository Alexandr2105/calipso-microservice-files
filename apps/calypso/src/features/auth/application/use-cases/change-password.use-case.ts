import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BcryptService } from '../../../../common/bcript/bcript.service';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { BadRequestException } from '@nestjs/common';
import { createErrorMessage } from '../../../../common/helpers/create-error-message';

export class ChangePasswordCommand {
  constructor(public recoveryCode: string, public newPassword: string) {}
}

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordUseCase
  implements ICommandHandler<ChangePasswordCommand>
{
  constructor(
    private bcryptService: BcryptService,
    private userRepo: UsersRepository,
  ) {}
  async execute(command: ChangePasswordCommand): Promise<void> {
    const infoEmailConfirmation = await this.userRepo.getConfirmationInfoByCode(
      command.recoveryCode,
    );

    if (
      !infoEmailConfirmation ||
      infoEmailConfirmation.expirationDate < new Date()
    )
      throw new BadRequestException(createErrorMessage('code'));

    const hash = await this.bcryptService.generateHashForNewUser(
      command.newPassword,
    );

    await this.userRepo.updateConfirmationEmail(
      infoEmailConfirmation.confirmationCode,
    );

    await this.userRepo.changePassword(infoEmailConfirmation.userId, hash);
  }
}
