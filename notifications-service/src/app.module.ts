import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { ReservationsModule } from './reservations/reservations.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AppModule as AppServiceModule } from './app/app.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    ReservationsModule,
    NotificationsModule,
    AppServiceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
