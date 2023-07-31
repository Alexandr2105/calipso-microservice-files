import { Module } from '@nestjs/common';
import { FilesMicroserviceController } from './files-microservice.controller';
import { FilesMicroserviceService } from './files-microservice.service';
import { PictureController } from './features/pictures/api/picture.controller';
import { TestingController } from './common/testing/testing.controller';
import { AvatarSchema } from './features/pictures/schemas/avatar.schema';
import { PostImagesSchema } from './features/pictures/schemas/post.images.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadAvatarUseCase } from './features/pictures/application/use-cases/upload.avatar.use.case';
import { FileStorageAdapterS3 } from './common/adapters/file.storage.adapter.s3';
import { AvatarsRepository } from './features/pictures/infrastructure/avatars.repository';
import { ImagesRepository } from './features/pictures/infrastructure/images.repository';
import { CreateImagesForPostUseCase } from './features/pictures/application/use-cases/create.images.for.post.use.case';
import { DeletePostImagesUseCase } from './features/pictures/application/use-cases/delete.post.images.use.case';
import { GetImagesForPostUseCase } from './features/pictures/application/use-cases/get.images.for.post.use.case';
import { CqrsModule } from '@nestjs/cqrs';

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
  controllers: [
    FilesMicroserviceController,
    PictureController,
    TestingController,
  ],
  providers: [
    FilesMicroserviceService,
    UploadAvatarUseCase,
    FileStorageAdapterS3,
    AvatarsRepository,
    ImagesRepository,
    CreateImagesForPostUseCase,
    GetImagesForPostUseCase,
    DeletePostImagesUseCase,
  ],
})
export class FilesMicroserviceModule {}
