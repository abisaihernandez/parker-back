import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RESERVATIONS_SERVICE } from 'src/constants/services';
import { ReservationPayload } from './types';
import { LotsService } from 'src/lots/lots.service';

@Injectable()
export class ReservationsService {
  constructor(
    @Inject(RESERVATIONS_SERVICE)
    private readonly reservationsClient: ClientProxy,
    private readonly lotsService: LotsService,
  ) {}

  async createReservation(userId: number, lotId: number) {
    const availableSpotId = await this.lotsService.findAvailableSpotId(lotId);

    if (!availableSpotId) {
      throw new BadRequestException({
        message: 'No spots available in this lot',
      });
    }

    return firstValueFrom(
      this.reservationsClient.send<ReservationPayload | null>(
        'create_reservation',
        { userId, spotId: availableSpotId },
      ),
    );
  }

  async getUserCurrentReservation(userId: number) {
    const reservation = await firstValueFrom(
      this.reservationsClient.send<ReservationPayload | null>(
        'get_user_current_reservation',
        { userId },
      ),
    );

    if (!reservation) {
      return null;
    }

    const lot = await this.lotsService.getLotFromSpotId(reservation.spotId);

    return {
      ...reservation,
      lot,
    };
  }

  async cancelUserCurrentReservation(userId: number) {
    return await firstValueFrom(
      this.reservationsClient.send<ReservationPayload | null>(
        'cancel_user_current_reservation',
        { userId },
      ),
    );
  }

  async userCurrentReservationCheckIn(userId: number) {
    return await firstValueFrom(
      this.reservationsClient.send<ReservationPayload | null>('user_current_reservation_check_in', { userId })
    )
  }

  async userCurrentReservationCheckOut(userId: number) {
    return await firstValueFrom(
      this.reservationsClient.send<ReservationPayload | null>('user_current_reservation_check_out', { userId })
    )
  }
}
