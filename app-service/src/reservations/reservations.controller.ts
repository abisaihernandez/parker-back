import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserPayload } from 'src/constants/types';
import { UseAuth } from 'src/identity/decorators/use-auth.decorator';
import { User } from 'src/identity/decorators/user.decorator';
import { ReservationsService } from './reservations.service';
import { CreateReservationRequestDto } from './dto/create-reservation.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post('/')
  @UseAuth()
  async createReservation(
    @User() user: UserPayload,
    @Body() createReservationRequestDto: CreateReservationRequestDto,
  ) {
    return this.reservationsService.createReservation(
      user.id,
      createReservationRequestDto.lotId,
    );
  }

  @Get('current')
  @UseAuth()
  async getCurrentReservation(@User() user: UserPayload) {
    return this.reservationsService.getUserCurrentReservation(user.id);
  }

  @Post('current/cancel')
  @UseAuth()
  async cancelCurrentUserReservation(@User() user: UserPayload) {
    return this.reservationsService.cancelUserCurrentReservation(user.id);
  }

  @Post('current/check-in')
  @UseAuth()
  async checkInCurrentUserReservation(@User() user: UserPayload) {
    return this.reservationsService.userCurrentReservationCheckIn(user.id);
  }

  @Post('current/check-out')
  @UseAuth()
  async checkOutCurrentUserReservation(@User() user: UserPayload) {
    return this.reservationsService.userCurrentReservationCheckOut(user.id);
  }

  @Get(':id')
  @UseAuth()
  async getReservation(@Param('id') id: number) {
    return this.reservationsService.getReservation(id);
  }

  @Get(':id/actions')
  @UseAuth()
  async getReservationActionsForUser(
    @Param('id') reservationId: number,
    @User() user: UserPayload,
  ) {
    return this.reservationsService.getReservationActionsForUser(
      reservationId,
      user.id,
    );
  }
}
