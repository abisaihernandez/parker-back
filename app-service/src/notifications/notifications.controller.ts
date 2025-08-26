import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class NotificationsController {
  @EventPattern('realtime_update')
  async handleRealtimeUpdate(body: unknown) {
    console.log(`Received realtime_update message`);
    console.log(JSON.stringify(body));

    return {};
  }
}
