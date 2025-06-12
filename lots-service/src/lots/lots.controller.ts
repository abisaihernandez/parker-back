import { Controller } from '@nestjs/common';
import { LotsService } from './lots.service';
import { GetLotsQueryDto, LotEditableFields } from './types';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @MessagePattern('get_lots')
  async getLots(config: GetLotsQueryDto) {
    return await this.lotsService.getLots(config);
  }

  @MessagePattern('get_lot')
  async getLot({ lotId }: { lotId: number }) {
    return await this.lotsService.getLotById(lotId);
  }

  @MessagePattern('create_lot')
  async createLot({
    creatorId,
    data,
    spotsCount,
  }: {
    creatorId: number;
    data: LotEditableFields;
    spotsCount: number;
  }) {
    return this.lotsService.createLot(creatorId, data, spotsCount);
  }

  @MessagePattern('update_lot')
  async updateLot({
    id,
    data,
  }: {
    id: number;
    data: Partial<LotEditableFields>;
  }) {
    return this.lotsService.updateLot(id, data);
  }

  @MessagePattern('delete_lot')
  async deleteLot({ id }: { id: number }) {
    return this.lotsService.deleteLot(id);
  }

  @MessagePattern('get_is_lot_owner')
  async getIsLotOwner({ id, userId }: { id: number; userId: number }) {
    return this.lotsService.isLotOwner(id, userId);
  }

  @MessagePattern('get_available_spot_id')
  async getAvailableSpotId({ lotId }: { lotId: number }) {
    const availableSpot = await this.lotsService.findAvailableSpot(lotId);
    return availableSpot?.id || null;
  }

  @MessagePattern('get_lot_from_spot_id')
  async getLotFromSpotId({ spotId }: { spotId: number }) {
    return this.lotsService.getLotFromSpotId(spotId);
  }
}
