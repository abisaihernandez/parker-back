import { Inject, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { reservation } from 'src/db/schema/reservation';
import { and, eq, gt, inArray, isNull, lt, not } from 'drizzle-orm';
import { ReservationSelect } from './types';
import { RABBITMQ_SERVICE } from 'src/constants';
import { ClientProxy } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ReservationsService {
  constructor(
    private dbService: DbService,
    @Inject(RABBITMQ_SERVICE)
    private readonly rabbitMqClient: ClientProxy,
  ) {}

  async createReservation(
    userId: number,
    spotId: number,
  ): Promise<ReservationSelect> {
    const currentReservation = await this.getUserCurrentReservation(userId);

    if (currentReservation) {
      throw new Error('User already has active reservation');
    }

    const insertedReservations = await this.dbService.db
      .insert(reservation)
      .values({
        spotId,
        userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })
      .returning();

    const createdReservation = insertedReservations[0];

    this.rabbitMqClient.emit('reservation_created', createdReservation);

    return createdReservation;
  }

  async getUserCurrentReservation(
    userId: number,
  ): Promise<ReservationSelect | null> {
    const result =
      (await this.dbService.db.query.reservation.findFirst({
        where: and(
          eq(reservation.userId, userId),
          and(
            isNull(reservation.checkOutAt),
            gt(reservation.expiresAt, new Date()),
            not(
              inArray(reservation.status, ['expired', 'completed', 'canceled']),
            ),
          ),
        ),
      })) ?? null;

    return result;
  }

  @Cron('* * * * *')
  async handleExpiredReservations() {
    const expiredReservations =
      await this.dbService.db.query.reservation.findMany({
        where: and(
          isNull(reservation.checkOutAt),
          lt(reservation.expiresAt, new Date()),
          inArray(reservation.status, ['pending']),
        ),
      });

    for (const expiredReservation of expiredReservations) {
      await this.dbService.db
        .update(reservation)
        .set({ status: 'expired' })
        .where(eq(reservation.id, expiredReservation.id));

      this.rabbitMqClient.emit('reservation_expired', expiredReservation);
    }
  }

  async cancelUserCurrentReservation(userId: number) {
    const currentReservation = await this.getUserCurrentReservation(userId);

    if (!currentReservation) {
      throw new Error('User does not have active reservation');
    }

    const canceledReservation = await this.dbService.db
      .update(reservation)
      .set({ status: 'canceled' })
      .where(eq(reservation.id, currentReservation.id))
      .returning();

    this.rabbitMqClient.emit('reservation_canceled', currentReservation);

    return canceledReservation;
  }

  async userCurrentReservationCheckIn(userId: number) {
    const currentReservation = await this.getUserCurrentReservation(userId);

    if (!currentReservation) {
      throw new Error('User does not have active reservation');
    }

    const checkedInReservation = await this.dbService.db
      .update(reservation)
      .set({ status: 'active', checkInAt: new Date() })
      .where(eq(reservation.id, currentReservation.id))
      .returning();

    return checkedInReservation;
  }

  async userCurrentReservationCheckOut(userId: number) {
    const currentReservation = await this.getUserCurrentReservation(userId);

    if (!currentReservation) {
      throw new Error('User does not have active reservation');
    }

    const checkedInReservation = await this.dbService.db
      .update(reservation)
      .set({ status: 'completed', checkOutAt: new Date() })
      .where(eq(reservation.id, currentReservation.id))
      .returning();

    return checkedInReservation;
  }

  async getReservationsOnSpots(spotIds: number[]) {
    return await this.dbService.db.query.reservation.findMany({
      where: inArray(reservation.spotId, spotIds),
    });
  }

  async getReservationById(id: number) {
    return await this.dbService.db.query.reservation.findFirst({
      where: eq(reservation.id, id),
    });
  }
}
