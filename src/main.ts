import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // await app.listen(3001);

  // const app = await NestFactory.create(AppModule);
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.TCP,
  //   options: { port: 3002 },
  // });
  // await app.startAllMicroservices();
  // await app.listen(3001, () => {
  //   console.log('Started 3001 port');
  // });

  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule,
  //   {
  //     transport: Transport.TCP,
  //     options: {
  //       port: 3002,
  //     },
  //   },
  // );
  // await app.listen();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
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
    },
  );
  await app.listen();
}
bootstrap();
