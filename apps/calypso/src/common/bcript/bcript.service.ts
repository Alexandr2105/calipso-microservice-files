import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptService {
  async generateHashForNewUser(password: string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return this.generateHash(password, salt);
  }

  async generateHash(pass: string, salt: string) {
    return bcrypt.hash(pass, salt);
  }
}
