import { IsInt, IsString, IsEnum, Min } from 'class-validator';
import { RoomType } from '@prisma/client';

export class CreateRoomDto {
  @IsInt()
  theater_id: number;

  @IsString()
  room_name: string;

  @IsString()
  room_slug: string;

  @IsInt()
  @Min(1)
  row: number;

  @IsInt()
  @Min(1)
  column: number;

  @IsEnum(RoomType)
  room_type: RoomType;
}
