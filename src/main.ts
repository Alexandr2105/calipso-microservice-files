import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import * as process from 'process';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // await app.listen(3001);

  // const app = await NestFactory.create(AppModule);
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.TCP,
  //   options: { port: 3001, host: '0.0.0.0' },
  // });
  // await app.startAllMicroservices();
  // await app.listen(process.env.PORT || 3002, () => {
  //   console.log('Started');
  // });

  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule,
  //   {
  //     transport: Transport.TCP,
  //     options: { port: 3001, host: '0.0.0.0' },
  //   },
  // );
  // await app.listen();

  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule,
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

  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        'amqps://nvvffhzg:kunlrWhEIXXBPudNmmJTPT20KOCf8-80@stingray.rmq.cloudamqp.com/nvvffhzg',
      ],
      queue: 'FILES_SERVICE',
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.PORT, () => {
    console.log('Started 3001');
  });
}
bootstrap();
