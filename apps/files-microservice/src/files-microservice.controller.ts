import { Controller, Get } from '@nestjs/common';
import { FilesMicroserviceService } from './files-microservice.service';

@Controller()
export class FilesMicroserviceController {
  constructor(
    private readonly filesMicroserviceService: FilesMicroserviceService,
  ) {}

  @Get()
  getHello(): string {
    return this.filesMicroserviceService.getHello();
  }
}
