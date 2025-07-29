import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RESERVATIONS_SERVICE } from 'src/constants/services';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { LotsModule } from 'src/lots/lots.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: RESERVATIONS_SERVICE,
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.TCP,
            options: {
              host: configService.getOrThrow('RESERVATIONS_SERVICE_HOST'),
              port:
                configService.getOrThrow('RESERVATIONS_SERVICE_PORT') || 3000,
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
    forwardRef(() => LotsModule),
  ],
  providers: [ReservationsService],
  exports: [ReservationsService],
  controllers: [ReservationsController],
})
export class ReservationsModule {}
