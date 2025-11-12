import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('theaters/:theaterSlug/rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  // Lấy tất cả phòng trong 1 theater
  @Get()
  findAllInTheater(@Param('theaterSlug') theaterSlug: string) {
    return this.roomService.findAllInTheater(theaterSlug);
  }

  // Tạo room trong theater cụ thể
  @Post()
  create(
    @Param('theaterSlug') theaterSlug: string,
    @Body() createRoomDto: CreateRoomDto
  ) {
    return this.roomService.create(theaterSlug, createRoomDto);
  }

  // Lấy room cụ thể theo roomSlug (trước là roomName)
  @Get(':roomSlug')
  findOne(
    @Param('theaterSlug') theaterSlug: string,
    @Param('roomSlug') roomSlug: string
  ) {
    return this.roomService.findOne(theaterSlug, roomSlug);
  }

  // Cập nhật room theo roomSlug
  @Patch(':roomSlug')
  update(
    @Param('theaterSlug') theaterSlug: string,
    @Param('roomSlug') roomSlug: string,
    @Body() updateRoomDto: UpdateRoomDto
  ) {
    return this.roomService.update(theaterSlug, roomSlug, updateRoomDto);
  }

  // Xóa room theo roomSlug
  @Delete(':roomSlug')
  remove(
    @Param('theaterSlug') theaterSlug: string,
    @Param('roomSlug') roomSlug: string
  ) {
    return this.roomService.remove(theaterSlug, roomSlug);
  }
}

// Controller riêng để lấy rooms theo theater ID
@Controller('rooms')
export class RoomByIdController {
  constructor(private readonly roomService: RoomService) {}

  // Lấy tất cả phòng trong 1 theater theo ID
  @Get('theater/:theaterId')
  findAllInTheaterById(@Param('theaterId', ParseIntPipe) theaterId: number) {
    return this.roomService.findAllInTheaterById(theaterId);
  }
}
