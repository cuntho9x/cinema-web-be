import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ScheduleShowtimeService } from './schedule-showtime.service';
import { CreateScheduleShowtimeDto } from './dto/create-schedule-showtime.dto';

@Controller('schedule-showtime')
export class ScheduleShowtimeController {
  constructor(private readonly scheduleShowtimeService: ScheduleShowtimeService) {}

  @Post()
  create(@Body() dto: CreateScheduleShowtimeDto) {
    return this.scheduleShowtimeService.create(dto);
  }

  @Get()
  findAll() {
    return this.scheduleShowtimeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleShowtimeService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleShowtimeService.remove(+id);
  }
}
