import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SeatType, SeatStatus } from '@prisma/client';

export class UpdateSeatDto {
  @IsOptional()
  @IsEnum(SeatType)
  seat_type?: SeatType;

  @IsOptional()
  @IsEnum(SeatStatus)
  status?: SeatStatus;

  @IsOptional()
  @IsString()
  seat_code?: string;
}
