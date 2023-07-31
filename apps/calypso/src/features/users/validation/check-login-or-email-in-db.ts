import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';

@ValidatorConstraint({ async: true })
@Injectable()
export class CheckLoginOrEmailInDb implements ValidatorConstraintInterface {
  constructor(private readonly usersRepo: UsersRepository) {}
  async validate(loginOrEmail: string): Promise<boolean> {
    const user = await this.usersRepo.getUserByLoginOrEmail(loginOrEmail);
    if (
      user &&
      user.emailConfirmation.isConfirmed === false &&
      user.emailConfirmation.expirationDate < new Date()
    ) {
      await this.usersRepo.deleteExpirationCode(user.id);
      await this.usersRepo.deleteExpirationUser(user.id);
      return true;
    }
    return !user;
  }
}
