import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RegistrationUserUseCase } from './features/auth/application/use-cases/registration-user.use-case';
import { CreateConfirmationInfoForUserUseCase } from './features/auth/application/use-cases/create-confirmation-info.use-case';
import { SendConfirmationLinkUseCase } from './features/auth/application/use-cases/send-confirmation-link.use-case';
import { ConfirmationEmailUseCase } from './features/auth/application/use-cases/confirmation-email.use-case';
import { RefreshConfirmationLinkUseCase } from './features/auth/application/use-cases/refresh-confirmation-link.use-case';
import { AuthController } from './features/auth/api/auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersController } from './features/users/api/users.controller';
import { BcryptService } from './common/bcript/bcript.service';
import { UsersRepository } from './features/users/infrastructure/users.repository';
import { EmailAdapter } from './common/SMTP-adapter/email-adapter';
import { CheckLoginOrEmailInDb } from './features/users/validation/check-login-or-email-in-db';
import { TestingController } from './common/testing/testing.controller';
import { SendPasswordRecoveryLinkUseCase } from './features/auth/application/use-cases/send-password-recovery-link.use-case';
import { UsersService } from './features/users/application/users.service';
import { ChangePasswordUseCase } from './features/auth/application/use-cases/change-password.use-case';
import { settings } from './settings';
import { LocalStrategy } from './common/strategies/local.strategy';
import { Jwt } from './common/jwt/jwt';
import { JwtModule } from '@nestjs/jwt';
import { CreateAccessAndRefreshTokensUseCase } from './features/auth/application/use-cases/create-access-and-refresh-tokens.use-case';
import { CheckConfirmationCode } from './features/auth/validation/check-confirmation-code';
import { DevicesRepository } from './features/devices/infrastructure/devices.repository';
import { RefreshStrategy } from './common/strategies/refresh.strategy';
import { SaveInfoAboutDevicesUserUseCase } from './features/devices/application/use-cases/save.info.about.devices.user.use.case';
import { LogoutUserUseCase } from './features/devices/application/use-cases/logout.user.use.case';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from './common/prisma/prisma.module';
import { UpdateInfoAboutDevicesUserUseCase } from './features/devices/application/use-cases/update.info.about.devices.user.use.case';
import { UsersProfilesController } from './features/users-profiles/api/users.profiles.controller';
import { SaveInfoAboutUsersProfilesUseCase } from './features/users-profiles/application/use-cases/save.info.about.users.profiles.use.case';
import { UsersProfilesRepository } from './features/users-profiles/infrastructure/users.profiles.repository';
import { JwtStrategy } from './common/strategies/jwt.strategy';
import { UploadAvatarUseCase } from './features/users-profiles/application/use-cases/upload.avatar.user.case';
import { GetUserProfileUseCase } from './features/users-profiles/application/use-cases/get.user.profile.use.case';
import { PostsController } from './features/posts/api/posts.controller';
import { CreatePostUseCase } from './features/posts/application/use-cases/create.post.use.case';
import { PostsRepository } from './features/posts/infrastructure/posts.repository';
import { CheckPostId } from './features/posts/validation/check.post.id';
import { UpdateDescriptionForPostUseCase } from './features/posts/application/use-cases/update.description.for.post.use.case';
import { DeletePostUseCase } from './features/posts/application/use-cases/delete.post.use.case';
import { QueryRepository } from './features/query-repository.ts/query.repository';
import { QueryHelper } from './common/helpers/query.helper';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GetUserByIdUseCase } from './features/users-profiles/application/use-cases/get.user.by.id.use.case';

const Strategies = [LocalStrategy, RefreshStrategy, JwtStrategy];
const Validators = [CheckLoginOrEmailInDb, CheckConfirmationCode, CheckPostId];
const UseCases = [
  RegistrationUserUseCase,
  CreateConfirmationInfoForUserUseCase,
  SendConfirmationLinkUseCase,
  ConfirmationEmailUseCase,
  RefreshConfirmationLinkUseCase,
  SendPasswordRecoveryLinkUseCase,
  ChangePasswordUseCase,
  CreateAccessAndRefreshTokensUseCase,
  SaveInfoAboutDevicesUserUseCase,
  LogoutUserUseCase,
  UpdateInfoAboutDevicesUserUseCase,
  SaveInfoAboutUsersProfilesUseCase,
  UploadAvatarUseCase,
  GetUserProfileUseCase,
  CreatePostUseCase,
  UpdateDescriptionForPostUseCase,
  DeletePostUseCase,
  GetUserByIdUseCase,
];
const Repositories = [
  UsersRepository,
  DevicesRepository,
  UsersProfilesRepository,
  PostsRepository,
  QueryRepository,
];

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'FILES_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 3001,
          // host: 'calypso-microservice-files.fly.dev',
        },
      },
    ]),

    // ClientsModule.register([
    //   {
    //     name: 'FILES_SERVICE',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: [
    //         'amqps://nvvffhzg:kunlrWhEIXXBPudNmmJTPT20KOCf8-80@stingray.rmq.cloudamqp.com/nvvffhzg',
    //       ],
    //       queue: 'FILES_SERVICE',
    //       queueOptions: {
    //         durable: false,
    //       },
    //     },
    //   },
    // ]),
    PrismaModule,
    CqrsModule,
    JwtModule.register({}),
    PassportModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: settings.SWAGGER === 'development' ? '/' : '/swagger',
    }),
    // FilesMicroserviceModule,
  ],
  controllers: [
    AppController,
    AuthController,
    UsersController,
    TestingController,
    UsersProfilesController,
    PostsController,
  ],
  providers: [
    AppService,
    BcryptService,
    UsersService,
    EmailAdapter,
    ...Validators,
    ...UseCases,
    ...Strategies,
    ...Repositories,
    Jwt,
    QueryHelper,
  ],
})
export class AppModule {}
