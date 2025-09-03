import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ScheduleListService } from './schedule-list.service';
import { CreateScheduleListDto } from './dto/create-schedule-list.dto';

@Controller('schedule-list')
export class ScheduleListController {
  constructor(private readonly scheduleListService: ScheduleListService) {}

  @Post()
  create(@Body() dto: CreateScheduleListDto) {
    return this.scheduleListService.create(dto);
  }

  @Get()
  findAll() {
    return this.scheduleListService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleListService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleListService.remove(+id);
  }
}
