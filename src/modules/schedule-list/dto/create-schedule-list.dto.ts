import { IsInt, IsDateString } from 'class-validator';

export class CreateScheduleListDto {
  @IsInt()
  movie_id: number;

  @IsDateString()
  start_date: Date;

  @IsDateString()
  end_date: Date;
}
