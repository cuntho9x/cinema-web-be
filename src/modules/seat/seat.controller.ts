import { Controller, Get, Patch, Delete, Param, Body, Post } from '@nestjs/common';
import { SeatService } from './seat.service';
import { UpdateSeatDto } from './dto/update-seat.dto';

@Controller('theaters/:theaterSlug/rooms/:roomSlug/seats')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Get()
  findAllInRoom(
    @Param('theaterSlug') theaterSlug: string,
    @Param('roomSlug') roomSlug: string,
  ) {
    return this.seatService.findAllInRoom(theaterSlug, roomSlug);
  }

  // Route 'bulk-update' MUST come before ':seatCode' to avoid route conflict
  @Post('bulk-update')
  updateMany(
    @Param('theaterSlug') theaterSlug: string,
    @Param('roomSlug') roomSlug: string,
    @Body() updates: Array<{ seatCode: string; seat_type?: string; status?: string }>,
  ) {
    return this.seatService.updateMany(theaterSlug, roomSlug, updates);
  }

  @Get(':seatCode')
  findOne(
    @Param('theaterSlug') theaterSlug: string,
    @Param('roomSlug') roomSlug: string,
    @Param('seatCode') seatCode: string,
  ) {
    return this.seatService.findOne(theaterSlug, roomSlug, seatCode);
  }

  @Patch(':seatCode')
  update(
    @Param('theaterSlug') theaterSlug: string,
    @Param('roomSlug') roomSlug: string,
    @Param('seatCode') seatCode: string,
    @Body() updateSeatDto: UpdateSeatDto,
  ) {
    return this.seatService.update(theaterSlug, roomSlug, seatCode, updateSeatDto);
  }

  @Delete(':seatCode')
  remove(
    @Param('theaterSlug') theaterSlug: string,
    @Param('roomSlug') roomSlug: string,
    @Param('seatCode') seatCode: string,
  ) {
    return this.seatService.remove(theaterSlug, roomSlug, seatCode);
  }
}
