import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { randomUUID } from 'crypto';
import { ConfirmationInfoEntity } from '../../../users/entities/confirmation-info.entity';
import { createExpirationDateForLink } from '../../../../common/helpers/create-expiration-date-for-link';

export class CreateConfirmationInfoForUserCommand {
  constructor(public userId: string) {}
}

@CommandHandler(CreateConfirmationInfoForUserCommand)
export class CreateConfirmationInfoForUserUseCase
  implements ICommandHandler<CreateConfirmationInfoForUserCommand>
{
  constructor(private userRepo: UsersRepository) {}
  async execute(
    command: CreateConfirmationInfoForUserCommand,
  ): Promise<string> {
    const expDate = createExpirationDateForLink(3600);

    const userId = command.userId;

    const confirmCode = randomUUID();

    const newConfirmationInfo = new ConfirmationInfoEntity(
      userId,
      confirmCode,
      expDate,
      false,
    );

    await this.userRepo.saveEmailConfirmation(newConfirmationInfo);

    return confirmCode;
  }
}
