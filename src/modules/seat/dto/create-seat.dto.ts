import { IsEnum, IsInt, IsString, Min } from 'class-validator';
import { SeatStatus, SeatType } from '@prisma/client';

export class CreateSeatDto {
  @IsInt()
  room_id: number;

  @IsString()
  row_label: string;

  @IsInt()
  @Min(1)
  column_number: number;

  @IsString()
  seat_code: string;

  @IsEnum(SeatType)
  seat_type: SeatType;

  @IsEnum(SeatStatus)
  status: SeatStatus;
}
