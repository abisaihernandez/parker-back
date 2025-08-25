import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ReservationPayload } from './types';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
export class ReservationsController {
  /**
   * TODO: Notify lot owner
   * @EventPattern('reservation_created')
   * async handleReservationCreated(data: ReservationPayload) {}
   */

  constructor(private readonly reservationsService: ReservationsService) {}

  @EventPattern('reservation_updated')
  async handleReservationExpired(data: ReservationPayload) {
    console.log('handling event: reservation_updated');
    console.log(data);
    await this.reservationsService.handleReservationUpdated(data);
  }
}
