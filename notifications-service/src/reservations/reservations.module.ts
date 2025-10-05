import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  controllers: [ReservationsController],
  providers: [ReservationsService],
  imports: [NotificationsModule]
})
export class ReservationsModule {}
