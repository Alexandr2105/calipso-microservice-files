import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma-service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('delete-all-data')
export class TestingController {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('FILES_SERVICE') private client: ClientProxy,
  ) {}
  @Delete()
  @HttpCode(204)
  async clearAllData(): Promise<HttpStatus> {
    await this.prisma.refreshTokenData.deleteMany();

    await this.prisma.emailConfirmation.deleteMany();

    await this.prisma.post.deleteMany();

    await this.prisma.userProfile.deleteMany();

    await this.prisma.user.deleteMany();

    await firstValueFrom(this.client.send({ cmd: 'deleteAll' }, {}));

    return;
  }
}
