import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
// import { ConfigService } from '@nestjs/config';
// import { RmqUrl } from '@nestjs/microservices/external/rmq-url.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '::',
      port: 3000,
    },
  });

  /*
  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow<RmqUrl>('RABBITMQ_URL')],
      queue: 'reservations',
    },
  });
  */

  await app.startAllMicroservices();
}
bootstrap();
