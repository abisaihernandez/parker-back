import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LOTS_SERVICE } from 'src/constants/services';
import {
  Bounds,
  GetLotsFromSpotIdsDto,
  LotEditableFields,
  LotPayload,
} from './types';
import { firstValueFrom } from 'rxjs';
import { ReservationsService } from 'src/reservations/reservations.service';

@Injectable()
export class LotsService {
  constructor(
    @Inject(LOTS_SERVICE) private readonly lotsClient: ClientProxy,
    @Inject(forwardRef(() => ReservationsService))
    private readonly reservationsService: ReservationsService,
  ) {}

  async createLot(
    creatorId: number,
    data: LotEditableFields,
    spotsCount: number,
  ) {
    return firstValueFrom(
      this.lotsClient.send<LotPayload>('create_lot', {
        creatorId,
        data,
        spotsCount,
      }),
    );
  }

  async isLotOwner(lotId: number, userId: number) {
    return firstValueFrom<boolean>(
      this.lotsClient.send('get_is_lot_owner', { id: lotId, userId }),
    );
  }

  async updateLot(lotId: number, updatedData: Partial<LotEditableFields>) {
    return firstValueFrom<LotPayload>(
      this.lotsClient.send('update_lot', { id: lotId, data: updatedData }),
    );
  }

  async getLots(config: {
    withAvailability?: boolean;
    bounds?: Bounds;
    ownerId?: number;
    availabilityForecastDay?: number;
    availabilityForecastHour?: number;
  }) {
    return firstValueFrom(
      this.lotsClient.send<LotPayload[]>('get_lots', config),
    );
  }

  async deleteLot(lotId: number) {
    return firstValueFrom<void>(this.lotsClient.send('delete_lot', lotId));
  }

  async findAvailableSpotId(
    lotId: number,
    time: Date = new Date(),
  ): Promise<number | null> {
    return firstValueFrom(
      this.lotsClient.send<number | null>('get_available_spot_id', {
        lotId,
        time,
      }),
    );
  }

  async getLotFromSpotId(spotId: number): Promise<LotPayload | null> {
    return firstValueFrom(
      this.lotsClient.send<LotPayload | null>('get_lot_from_spot_id', {
        spotId,
      }),
    );
  }

  async getLot(lotId: number): Promise<LotPayload | null> {
    return firstValueFrom(
      this.lotsClient.send<LotPayload | null>('get_lot', {
        lotId,
      }),
    );
  }

  async getOwnedSpots(
    ownerId: number,
  ): Promise<Array<{ id: number; lotId: number }> | null> {
    return firstValueFrom(
      this.lotsClient.send<Array<{ id: number; lotId: number }> | null>(
        'get_owned_spot_ids',
        { ownerId },
      ),
    );
  }

  async getReservationsOnOwnedLots(ownerId: number) {
    const ownedLots = await this.getLots({ ownerId });
    const ownedSpots = await this.getOwnedSpots(ownerId);

    if (!ownedSpots) throw new Error('Unable to fetch owned spots');

    const reservationsOnOwnedSpots =
      await this.reservationsService.getReservationsOnSpots(
        ownedSpots.map(({ id }) => id),
      );

    return reservationsOnOwnedSpots?.map((reservation) => {
      const reservedSpot = ownedSpots.find(
        (spot) => spot.id === reservation.spotId,
      );

      if (!reservedSpot) {
        throw new Error('Unable to find reserved spot');
      }

      const reservedLot = ownedLots.find(
        (lot) => lot.id === reservedSpot.lotId,
      );

      return {
        ...reservation,
        lot: reservedLot,
      };
    });
  }

  async getLotsFromSpotIds(spotIds: number[]) {
    return firstValueFrom(
      this.lotsClient.send<GetLotsFromSpotIdsDto | null>(
        'get_lots_from_spot_ids',
        {
          spotIds,
        },
      ),
    );
  }
}
