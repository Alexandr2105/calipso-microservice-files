import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UserEntity } from '../../../users/entities/user.entity';
import { BcryptService } from '../../../../common/bcript/bcript.service';
import { randomUUID } from 'crypto';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { CreateConfirmationInfoForUserCommand } from './create-confirmation-info.use-case';
import { SendConfirmationLinkCommand } from './send-confirmation-link.use-case';

export class RegistrationUserCommand {
  constructor(public body: CreateUserDto) {}
}

@CommandHandler(RegistrationUserCommand)
export class RegistrationUserUseCase
  implements ICommandHandler<RegistrationUserCommand>
{
  constructor(
    private bcryptService: BcryptService,
    private userRepo: UsersRepository,
    private commandBus: CommandBus,
  ) {}
  async execute(command: RegistrationUserCommand): Promise<void> {
    const hash = await this.bcryptService.generateHashForNewUser(
      command.body.password,
    );
    const userId = randomUUID();
    const createdAt = new Date();

    const newUser = new UserEntity(
      userId,
      command.body.login,
      command.body.email,
      createdAt,
      hash,
      false,
    );

    await this.userRepo.createUser(newUser);

    const createConfirmationInfoAndReturnConfirmationCode =
      await this.commandBus.execute(
        new CreateConfirmationInfoForUserCommand(userId),
      );

    await this.commandBus.execute(
      new SendConfirmationLinkCommand(
        command.body.email,
        createConfirmationInfoAndReturnConfirmationCode,
      ),
    );
  }
}
