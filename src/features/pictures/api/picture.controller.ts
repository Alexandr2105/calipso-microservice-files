import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class PictureController {
  @MessagePattern({ cmd: 'avatar' })
  async saveAvatars(data: Buffer) {
    console.log(data);
    return 'data';
  }
}
