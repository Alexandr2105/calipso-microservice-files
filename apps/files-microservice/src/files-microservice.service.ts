import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesMicroserviceService {
  getHello(): string {
    return 'Hello World!';
  }
}
