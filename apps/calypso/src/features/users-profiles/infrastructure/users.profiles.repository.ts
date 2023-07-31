import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma-service';
import { UsersProfilesEntity } from '../entities/users.profiles.entity';

@Injectable()
export class UsersProfilesRepository {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async saveUsersProfiles(info: UsersProfilesEntity) {
    await this.prisma.userProfile.upsert({
      where: { userId: info.userId },
      create: info,
      update: info,
    });
  }

  async getProfile(userId: string): Promise<UsersProfilesEntity> | null {
    return this.prisma.userProfile.findUnique({
      where: { userId: userId },
    });
  }
}
