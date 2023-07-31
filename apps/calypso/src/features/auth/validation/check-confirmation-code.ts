import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../users/infrastructure/users.repository';

@ValidatorConstraint({ name: 'checkConfirmationCode', async: true })
@Injectable()
export class CheckConfirmationCode implements ValidatorConstraintInterface {
  constructor(private readonly usersRepository: UsersRepository) {}

  async validate(code: string): Promise<boolean> {
    const infoEmailConfirmation =
      await this.usersRepository.getConfirmationInfoByCode(code);
    if (!infoEmailConfirmation) return false;
    if (infoEmailConfirmation.isConfirmed) return false;
    if (infoEmailConfirmation.confirmationCode !== code) return false;
    return infoEmailConfirmation.expirationDate >= new Date();
  }

  defaultMessage(): string {
    return 'Incorrect confirmation code';
  }
}
