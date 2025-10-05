import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { APP_SERVICE } from 'src/constants/services';

@Module({
  providers: [AppService],
  imports: [
    ClientsModule.registerAsync([
      {
        name: APP_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow('APP_SERVICE_HOST'),
            port: configService.get('APP_SERVICE_TCP_PORT') || 3030,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [AppService],
})
export class AppModule {}
