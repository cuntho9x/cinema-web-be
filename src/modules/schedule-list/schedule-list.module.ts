import { Module } from '@nestjs/common';
import { ScheduleListService } from './schedule-list.service';
import { ScheduleListController } from './schedule-list.controller';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Module({
  controllers: [ScheduleListController],
  providers: [ScheduleListService, PrismaService],
})
export class ScheduleListModule {}
