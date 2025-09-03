import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleListDto } from './create-schedule-list.dto';

export class UpdateScheduleListDto extends PartialType(CreateScheduleListDto) {}
