import { Test, TestingModule } from '@nestjs/testing';
import { FilesMicroserviceController } from './files-microservice.controller';
import { FilesMicroserviceService } from './files-microservice.service';

describe('FilesMicroserviceController', () => {
  let filesMicroserviceController: FilesMicroserviceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FilesMicroserviceController],
      providers: [FilesMicroserviceService],
    }).compile();

    filesMicroserviceController = app.get<FilesMicroserviceController>(
      FilesMicroserviceController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(filesMicroserviceController.getHello()).toBe('Hello World!');
    });
  });
});
