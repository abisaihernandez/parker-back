import { /* Inject, */ Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Bounds, LotEditableFields, LotSelect } from './types';
import { lot } from 'src/db/schema/lot';
import { and, eq, sql } from 'drizzle-orm';
import { spot } from 'src/db/schema/spot';
// import { RESERVATIONS_SERVICE } from 'src/constants/services';
// import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class LotsService {
  constructor(
    private dbService: DbService,
    // @Inject(RESERVATIONS_SERVICE) reservationsService: ClientProxy
  ) {}

  async createLot(
    ownerId: number,
    lotData: LotEditableFields,
    spotsCount: number,
  ) {
    return this.dbService.db.transaction(async (tx) => {
      const createdLots = await tx
        .insert(lot)
        .values({
          name: lotData.name,
          address: lotData.address,
          location: sql`ST_SetSRID(ST_MakePoint(${lotData.location.longitude}, ${lotData.location.latitude}), 4326)`,
          ownerId,
        })
        .returning();

      const createdLot = createdLots[0];

      await tx.insert(spot).values(
        Array.from({ length: spotsCount }).map(() => ({
          lotId: createdLot.id,
        })),
      );

      return this.serializeLot(createdLot);
    });
  }

  async isLotOwner(lotId: number, userId: number) {
    const result = await this.dbService.db.query.lot.findFirst({
      where: and(eq(lot.id, lotId), eq(lot.ownerId, userId)),
    });

    return !!result;
  }

  async updateLot(lotId: number, updatedData: Partial<LotEditableFields>) {
    const updatedLots = await this.dbService.db
      .update(lot)
      .set({
        name: updatedData.name,
        address: updatedData.address,
        location: updatedData.location
          ? sql`ST_SetSRID(ST_MakePoint(${updatedData.location.longitude}, ${updatedData.location.latitude}), 4326)`
          : undefined,
      })
      .where(eq(lot.id, lotId))
      .returning();

    return this.serializeLot(
      // @ts-ignore -- drizzle error. can't expect-error because it's transitory
      updatedLots[0],
    );
  }

  async getLots(config: { withAvailability?: boolean; bounds?: Bounds }) {
    const query = this.dbService.db
      .select(
        config.withAvailability
          ? {
              ...lot,
              availability: sql<number>`COUNT(${spot.id})`,
            }
          : lot,
      )
      .from(lot)
      .where(
        config.bounds
          ? sql`ST_Contains(ST_MakeEnvelope(${
              config.bounds.southWest.longitude
            }, ${config.bounds.southWest.latitude}, ${
              config.bounds.northEast.longitude
            }, ${config.bounds.northEast.latitude}, 4326), ${lot.location})`
          : undefined,
      );

    if (config.withAvailability) {
      const result = await query
        .leftJoin(spot, and(eq(lot.id, spot.lotId), eq(spot.isAvailable, true)))
        .groupBy(lot.id);

      return result.map(this.serializeLot);
    }

    const result = await query;

    return result.map(this.serializeLot);
  }

  async deleteLot(lotId: number) {
    return this.dbService.db.delete(lot).where(eq(lot.id, lotId));
  }

  serializeLot(lot: LotSelect & { availability?: string }) {
    return {
      ...lot,
      location: {
        latitude: lot.location?.y,
        longitude: lot.location?.x,
      },
      ...(lot.availability
        ? { availability: Number(lot.availability) }
        : undefined),
    };
  }

  async findAvailableSpot(
    lotId: number,
    // time: Date = new Date(),
  ): Promise<Pick<typeof spot.$inferSelect, 'id'> | null> {
    const result = await this.dbService.db
      .select({ id: spot.id })
      .from(spot)
      .where(and(eq(spot.lotId, lotId), eq(spot.isAvailable, true)))
      .orderBy(spot.id)
      .limit(1);

    if (result.length > 0) {
      return result[0];
    }

    return null;
  }

  async getLotFromSpotId(spotId: number) {
    const spotResult = await this.dbService.db.query.spot.findFirst({
      where: eq(spot.id, spotId),
    });

    if (!spotResult) return null;

    // @ts-ignore -- why does drizzle not like lots?
    const lotResult: LotSelect = await this.dbService.db.query.lot.findFirst({
      where: eq(lot.id, spotResult.lotId),
    });

    return this.serializeLot(lotResult);
  }

  async getUserLots(userId: number) {
    return (
      await this.dbService.db.query.lot.findMany({
        where: eq(lot.ownerId, userId),
      })
    ).map(this.serializeLot);
  }
}
