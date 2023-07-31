import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../../features/users/infrastructure/users.repository';
import { BcryptService } from '../bcript/bcript.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userRepo: UsersRepository,
    private genHash: BcryptService,
  ) {
    super({
      usernameField: 'loginOrEmail',
    });
  }
  async validate(loginOrEmail: string, password: string): Promise<any> {
    const user = await this.userRepo.getUserByLoginOrEmail(loginOrEmail);

    if (!user || user.emailConfirmation.isConfirmed === false) return false;

    const hashPassword = await this.genHash.generateHash(
      password.toString(),
      user.passwordHash,
    );

    if (user.passwordHash === hashPassword) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }
}
