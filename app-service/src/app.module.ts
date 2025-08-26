import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { IdentityModule } from './identity/identity.module';
import { ConfigModule } from '@nestjs/config';
import { LotsModule } from './lots/lots.module';
import { ReservationsModule } from './reservations/reservations.module';

@Module({
  imports: [
    HealthModule,
    IdentityModule,
    LotsModule,
    ReservationsModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
