export type ReservationPayload = {
  id: number;
  userId: number;
  spotId: number;
  createdAt: string;
  updatedAt: string;
  startsAt: string;
  endsAt: string;
  status: ReservationStatus;
};

type ReservationStatus =
  | 'pending'
  | 'active'
  | 'completed'
  | 'canceled'
  | 'expired';
