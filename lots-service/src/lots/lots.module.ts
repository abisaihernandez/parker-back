import { Module } from '@nestjs/common';
import { LotsService } from './lots.service';
import { LotsController } from './lots.controller';
import { DbModule } from 'src/db/db.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RESERVATIONS_SERVICE } from 'src/constants/services';
import { ConfigService } from '@nestjs/config';
import { AvailabilityForecastModule } from 'src/availability-forecast/availability-forecast.module';

@Module({
  imports: [
    AvailabilityForecastModule,
    DbModule,
    ClientsModule.registerAsync([
      {
        name: RESERVATIONS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow('RESERVATIONS_SERVICE_HOST'),
            port: configService.get('RESERVATIONS_SERVICE_PORT') || 3000,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [LotsService],
  controllers: [LotsController],
})
export class LotsModule {}
