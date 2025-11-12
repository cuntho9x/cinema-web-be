import { Controller, Get, Post, Body, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ScheduleShowtimeService } from './schedule-showtime.service';
import { CreateScheduleShowtimeDto } from './dto/create-schedule-showtime.dto';
import { SeatService } from '../seat/seat.service';

@Controller('schedule-showtime')
export class ScheduleShowtimeController {
  constructor(
    private readonly scheduleShowtimeService: ScheduleShowtimeService,
    private readonly seatService: SeatService,
  ) {}

  @Post()
  create(@Body() dto: CreateScheduleShowtimeDto) {
    return this.scheduleShowtimeService.create(dto);
  }

  @Get()
  findAll(
    @Query('theaterId') theaterId?: string,
    @Query('roomId') roomId?: string,
    @Query('showDate') showDate?: string,
    @Query('movieId') movieId?: string,
  ) {
    // Chỉ parse nếu có giá trị, nếu không có thì để undefined
    const parsedTheaterId = theaterId && theaterId.trim() !== '' ? parseInt(theaterId, 10) : undefined;
    const parsedRoomId = roomId && roomId.trim() !== '' ? parseInt(roomId, 10) : undefined;
    const parsedShowDate = showDate && showDate.trim() !== '' ? showDate : undefined;
    const parsedMovieId = movieId && movieId.trim() !== '' ? parseInt(movieId, 10) : undefined;
    
    // Nếu có đủ 3 tham số (theaterId, roomId, showDate) → filter chặt chẽ (dùng cho admin portal)
    // Nếu chỉ có movieId → filter theo movie (dùng cho frontend)
    // Nếu không có gì → trả về tất cả
    
    return this.scheduleShowtimeService.findAll(parsedTheaterId, parsedRoomId, parsedShowDate, parsedMovieId);
  }

  // Specific routes must come before dynamic routes
  @Get('seat-prices/all')
  getAllSeatPrices() {
    return this.seatService.getAllSeatPrices();
  }

  // Route để lấy seats - phải đặt TRƯỚC route :id
  @Get('seats/:id')
  getSeats(@Param('id') id: string) {
    return this.scheduleShowtimeService.getSeatsByShowtimeId(+id);
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
