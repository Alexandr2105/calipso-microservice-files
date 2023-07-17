import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PictureController } from './features/pictures/api/picture.controller';

@Module({
  imports: [],
  controllers: [AppController, PictureController],
  providers: [AppService],
})
export class AppModule {}
