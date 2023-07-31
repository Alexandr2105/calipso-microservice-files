import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailAdapter } from '../../../../common/SMTP-adapter/email-adapter';

export class SendConfirmationLinkCommand {
  constructor(public email: string, public code: string) {}
}

@CommandHandler(SendConfirmationLinkCommand)
export class SendConfirmationLinkUseCase
  implements ICommandHandler<SendConfirmationLinkCommand>
{
  constructor(private emailService: EmailAdapter) {}
  async execute(command: SendConfirmationLinkCommand): Promise<void> {
    await this.emailService.sendEmailConfirmationLink(
      command.email,
      command.code,
    );
  }
}
