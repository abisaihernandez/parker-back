import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AppModule } from 'src/app/app.module';

@Module({
  providers: [NotificationsService],
  exports: [NotificationsService],
  imports: [AppModule],
})
export class NotificationsModule {}
