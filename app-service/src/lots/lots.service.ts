import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LOTS_SERVICE } from 'src/constants/services';
import { Bounds, LotEditableFields, LotPayload } from './types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LotsService {
  constructor(@Inject(LOTS_SERVICE) private readonly lotsClient: ClientProxy) {}

  async createLot(
    creatorId: number,
    data: LotEditableFields,
    spotsCount: number,
  ) {
    return firstValueFrom(
      this.lotsClient.send('create_lot', {
        creatorId,
        data,
        spotsCount,
      }),
    );
  }

  async isLotOwner(lotId: number, userId: number) {
    return firstValueFrom(
      this.lotsClient.send('get_is_lot_owner', { id: lotId, userId }),
    );
  }

  async updateLot(lotId: number, updatedData: Partial<LotEditableFields>) {
    return firstValueFrom(
      this.lotsClient.send('update_lot', { lotId, data: updatedData }),
    );
  }

  async getLots(config: { withAvailability?: boolean; bounds?: Bounds }) {
    return firstValueFrom(this.lotsClient.send('get_lots', config));
  }

  async deleteLot(lotId: number) {
    return firstValueFrom(this.lotsClient.send('delete_lot', lotId));
  }

  async doesLotExist(lotId: number) {
    return firstValueFrom(this.lotsClient.send('does_lot_exist', lotId));
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

  async getUserLots(userId: number): Promise<Array<LotPayload> | null> {
    return firstValueFrom(
      this.lotsClient.send<Array<LotPayload> | null>('get_user_lots', {
        userId,
      }),
    )
  }
}
