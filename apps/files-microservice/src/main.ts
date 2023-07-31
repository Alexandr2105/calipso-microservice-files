import { NestFactory } from '@nestjs/core';
import { FilesMicroserviceModule } from './files-microservice.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // const app = await NestFactory.create(FilesMicroserviceModule);
  // await app.listen(3000);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    FilesMicroserviceModule,
    {
      transport: Transport.TCP,
      options: { port: 3001 },
    },
  );
  await app.listen();

  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   FilesMicroserviceModule,
  //   {
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
  // );
  // await app.listen();
}
bootstrap();
