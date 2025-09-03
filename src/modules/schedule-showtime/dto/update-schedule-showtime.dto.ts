import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleShowtimeDto } from './create-schedule-showtime.dto';

export class UpdateScheduleShowtimeDto extends PartialType(CreateScheduleShowtimeDto) {}
