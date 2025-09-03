import { Module } from '@nestjs/common';
import { ScheduleShowtimeService } from './schedule-showtime.service';
import { ScheduleShowtimeController } from './schedule-showtime.controller';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Module({
  controllers: [ScheduleShowtimeController],
  providers: [ScheduleShowtimeService, PrismaService],
})
export class ScheduleShowtimeModule {}
