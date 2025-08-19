export type ReservationInsert = {
  userId: number;
  spotId: number;
  priceId?: number;
};

export type ReservationPayload = {
  id: number;
  userId: number;
  spotId: number;
  expiresAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  checkInAt: string | null;
  checkOutAt: string | null;
  status: ReservationStatus;
};

type ReservationStatus =
  | 'pending'
  | 'active'
  | 'completed'
  | 'check-out-initiated'
  | 'canceled'
  | 'expired';

export type ReservationActionType =
  | 'check-in'
  | 'initiate-check-out'
  | 'force-check-out'
  | 'confirm-check-out'
  | 'deny-check-out'
  | 'cancel';
