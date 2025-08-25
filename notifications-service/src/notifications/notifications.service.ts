import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app/app.service';
import { RealtimeUpdateType } from 'src/constants/realtime-update-type';

@Injectable()
export class NotificationsService {
  constructor(private readonly appService: AppService) {}

  async realtimeUpdate(updateType: RealtimeUpdateType, payload: unknown) {
    return this.appService.sendRealtimeUpdate(updateType, payload);
  }
}
