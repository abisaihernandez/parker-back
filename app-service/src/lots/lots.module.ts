import { forwardRef, Module } from '@nestjs/common';
import { LotsService } from './lots.service';
import { LotsController } from './lots.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LOTS_SERVICE } from 'src/constants/services';
import { ConfigService } from '@nestjs/config';
import { ReservationsModule } from 'src/reservations/reservations.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: LOTS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow('LOTS_SERVICE_HOST'),
            port: configService.get('LOTS_SERVICE_PORT') || 3000,
          },
        }),
        inject: [ConfigService],
      },
    ]),
    forwardRef(() => ReservationsModule),
  ],
  providers: [LotsService],
  exports: [LotsService],
  controllers: [LotsController],
})
export class LotsModule {}
