import {
  serial,
  integer,
  pgTable,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const reservationStatus = pgEnum('reservation_status', [
  'pending',
  'active',
  'completed',
  'check-out-initiated',
  'canceled',
  'expired',
]);

export const reservation = pgTable('reservations', {
  id: serial().primaryKey(),
  userId: integer().notNull(),
  spotId: integer().notNull(),
  expiresAt: timestamp(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date()),
  checkInAt: timestamp(),
  checkOutAt: timestamp(),

  status: reservationStatus('status').notNull().default('pending'),
});
