import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { IdentityModule } from './identity/identity.module';
import { ConfigModule } from '@nestjs/config';
import { LotsModule } from './lots/lots.module';
import { ReservationsModule } from './reservations/reservations.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RealtimeModule } from './realtime/realtime.module';

@Module({
  imports: [
    HealthModule,
    IdentityModule,
    LotsModule,
    ReservationsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    NotificationsModule,
    RealtimeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
