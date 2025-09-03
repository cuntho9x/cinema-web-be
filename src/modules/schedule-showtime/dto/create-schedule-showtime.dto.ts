import { IsInt, IsDateString, IsEnum } from 'class-validator';
import { GraphicsType, TranslationType } from '@prisma/client';

export class CreateScheduleShowtimeDto {
  @IsInt()
  movie_id: number;

  @IsInt()
  theater_id: number;

  @IsInt()
  room_id: number;

  @IsDateString()
  show_date: Date;

  @IsDateString()
  start_time: Date;

  @IsDateString()
  end_time: Date;

  @IsEnum(GraphicsType)
  graphics_type: GraphicsType;

  @IsEnum(TranslationType)
  translation_type: TranslationType;
}
