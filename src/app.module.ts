import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PictureController } from './features/pictures/api/picture.controller';
import { UploadAvatarUseCase } from './features/pictures/application/use-cases/upload.avatar.use.case';
import { FileStorageAdapterS3 } from './common/adapters/file.storage.adapter.s3';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { AvatarSchema } from './features/pictures/schemas/avatar.schema';
import { AvatarsRepository } from './features/pictures/infrastructure/avatars.repository';
import { PostImagesSchema } from './features/pictures/schemas/post.images.schema';
import { ImagesRepository } from './features/pictures/infrastructure/images.repository';
import { CreateImagesForPostUseCase } from './features/pictures/application/use-cases/create.images.for.post.use.case';
import { GetImagesForPostUseCase } from './features/pictures/application/use-cases/get.images.for.post.use.case';
import { DeletePostImagesUseCase } from './features/pictures/application/use-cases/delete.post.images.use.case';
import { TestingController } from './common/testing/testing.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_DB'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'avatar', schema: AvatarSchema },
      { name: 'postImages', schema: PostImagesSchema },
    ]),
    CqrsModule,
  ],
  controllers: [AppController, PictureController, TestingController],
  providers: [
    AppService,
    UploadAvatarUseCase,
    FileStorageAdapterS3,
    AvatarsRepository,
    ImagesRepository,
    CreateImagesForPostUseCase,
    GetImagesForPostUseCase,
    DeletePostImagesUseCase,
  ],
})
export class AppModule {}
