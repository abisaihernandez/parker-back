import { Injectable } from '@nestjs/common';
import { ReservationPayload } from './types';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class ReservationsService {
  constructor(private readonly notificationsService: NotificationsService) {}

  async handleReservationUpdated(data: ReservationPayload) {
    await this.notificationsService.realtimeUpdate('reservation-updated', data);
  }
}
