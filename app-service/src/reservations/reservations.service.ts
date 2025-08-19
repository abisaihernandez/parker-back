import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RESERVATIONS_SERVICE } from 'src/constants/services';
import { ReservationActionType, ReservationPayload } from './types';
import { LotsService } from 'src/lots/lots.service';

@Injectable()
export class ReservationsService {
  constructor(
    @Inject(RESERVATIONS_SERVICE)
    private readonly reservationsClient: ClientProxy,
    @Inject(forwardRef(() => LotsService))
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
      this.reservationsClient.send<ReservationPayload | null>(
        'user_current_reservation_check_in',
        { userId },
      ),
    );
  }

  async userCurrentReservationCheckOut(userId: number) {
    return await firstValueFrom(
      this.reservationsClient.send<ReservationPayload | null>(
        'user_current_reservation_check_out',
        { userId },
      ),
    );
  }

  async getReservationsOnSpots(spotIds: number[]) {
    return await firstValueFrom(
      this.reservationsClient.send<ReservationPayload[]>(
        'get_reservations_on_spots',
        { spotIds },
      ),
    );
  }

  private getReservationById(id: number) {
    return firstValueFrom(
      this.reservationsClient.send<ReservationPayload>(
        'get_reservation_by_id',
        { id },
      ),
    );
  }

  async getReservation(id: number) {
    const reservation = await this.getReservationById(id);
    const lot = await this.lotsService.getLotFromSpotId(reservation.spotId);

    return {
      ...reservation,
      lot,
    };
  }

  async getReservationActionsForUser(
    reservationId: number,
    userId: number,
  ): Promise<ReservationActionType[]> {
    const reservation = await this.getReservationById(reservationId);
    const lot = await this.lotsService.getLotFromSpotId(reservation.spotId);

    if (!reservation || !lot) return [];

    const didUserMakeReservation = reservation.userId === userId;
    const wasReservationMadeInUserLot = lot.ownerId === userId;

    const actions = new Set<ReservationActionType>();

    switch (reservation.status) {
      case 'pending':
        if (didUserMakeReservation) {
          actions.add('check-in');
          actions.add('cancel');
        } else if (wasReservationMadeInUserLot) {
          actions.add('cancel');
        }
        break;
      case 'check-out-initiated':
        if (wasReservationMadeInUserLot) {
          actions.add('confirm-check-out');
        }
        break;
      case 'active':
        if (didUserMakeReservation) {
          actions.add('initiate-check-out');
        } else if (wasReservationMadeInUserLot) {
          actions.add('force-check-out');
        }
        break;
      case 'completed':
      case 'canceled':
      case 'expired':
        break;
    }

    return Array.from(actions);
  }

  async forceCheckOut(reservationId: number) {
    return await firstValueFrom(
      this.reservationsClient.send<ReservationPayload | null>(
        'force_check_out',
        {
          id: reservationId,
        },
      ),
    );
  }

  async initiateCheckOut(reservationId: number) {
    return await firstValueFrom(
      this.reservationsClient.send<ReservationPayload | null>(
        'initiate_check_out',
        {
          id: reservationId,
        },
      ),
    );
  }

  async confirmCheckOut(reservationId: number) {
    return await firstValueFrom(
      this.reservationsClient.send<ReservationPayload | null>(
        'confirm_check_out',
        {
          id: reservationId,
        },
      ),
    );
  }

  async denyCheckOut(reservationId: number) {
    return await firstValueFrom(
      this.reservationsClient.send<ReservationPayload | null>(
        'deny_check_out',
        {
          id: reservationId,
        },
      ),
    );
  }
}
