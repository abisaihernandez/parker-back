import { BadRequestException, Controller } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationRequestDto } from './dto/create-reservation.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @MessagePattern('create_reservation')
  async createReservation(
    createReservationRequestDto: CreateReservationRequestDto,
  ) {
    try {
      const response = await this.reservationsService.createReservation(
        createReservationRequestDto.userId,
        createReservationRequestDto.spotId,
      );

      return response;
    } catch (error) {
      if (error.message == 'User already has active reservation') {
        throw new BadRequestException({ message: error.message });
      }

      throw error;
    }
  }

  @MessagePattern('get_user_current_reservation')
  async getUserCurrentReservation({ userId }: { userId: number }) {
    return this.reservationsService.getUserCurrentReservation(userId);
  }

  @MessagePattern('cancel_user_current_reservation')
  async cancelUserCurrentReservation({ userId }: { userId: number }) {
    return this.reservationsService.cancelUserCurrentReservation(userId);
  }

  @MessagePattern('cancel_reservation')
  async cancelReservation({ id }: { id: number }) {
    return this.reservationsService.cancelReservation(id);
  }

  @MessagePattern('user_current_reservation_check_in')
  async userCurrentReservationCheckIn({ userId }: { userId: number }) {
    return this.reservationsService.userCurrentReservationCheckIn(userId);
  }

  @MessagePattern('user_current_reservation_check_out')
  async userCurrentReservationCheckOut({ userId }: { userId: number }) {
    return this.reservationsService.userCurrentReservationCheckOut(userId);
  }

  @MessagePattern('get_reservations_on_spots')
  async getReservationsOnSpots({ spotIds }: { spotIds: number[] }) {
    return this.reservationsService.getReservationsOnSpots(spotIds);
  }

  @MessagePattern('get_reservation_by_id')
  async getReservationById({ id }: { id: number }) {
    return this.reservationsService.getReservationById(id);
  }

  @MessagePattern('initiate_check_out')
  async initiateCheckOut({ id }: { id: number }) {
    return this.reservationsService.initiateCheckOut(id);
  }

  @MessagePattern('confirm_check_out')
  async confirmCheckOut({ id }: { id: number }) {
    return this.reservationsService.confirmCheckOut(id);
  }

  @MessagePattern('force_check_out')
  async forceCheckOut({ id }: { id: number }) {
    return this.reservationsService.forceCheckOut(id);
  }

  @MessagePattern('deny_check_out')
  async denyCheckOut({ id }: { id: number }) {
    return this.reservationsService.denyCheckOut(id);
  }

  @MessagePattern('check_in')
  async checkIn({ id }: { id: number }) {
    return this.reservationsService.checkIn(id);
  }

  @MessagePattern('get_reservations')
  async getReservations({ madeByUserId }: { madeByUserId: number }) {
    return this.reservationsService.getReservations(madeByUserId);
  }
}
