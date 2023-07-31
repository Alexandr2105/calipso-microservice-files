import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity implements Prisma.UserCreateInput {
  @ApiProperty({ type: 'string', description: 'User id' })
  id: string;
  @ApiProperty({ type: 'string', description: 'User login' })
  login: string;
  @ApiProperty({ type: 'string', description: 'User email' })
  email: string;

  createdAt: Date;

  passwordHash: string;

  isDeleted: boolean;

  constructor(
    id: string,
    login: string,
    email: string,
    createdAt: Date,
    passwordHash: string,
    isDeleted: boolean,
  ) {
    (this.id = id),
      (this.login = login),
      (this.email = email),
      (this.createdAt = createdAt),
      (this.passwordHash = passwordHash),
      (this.isDeleted = isDeleted);
  }
}
