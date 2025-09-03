import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UpdateSeatDto } from './dto/update-seat.dto';

@Injectable()
export class SeatService {
  constructor(private prisma: PrismaService) {}

  private async findRoomId(theaterSlug: string, roomSlug: string): Promise<number> {
    const room = await this.prisma.room.findFirst({
      where: {
        room_slug: roomSlug,
        theater: { theater_title_url: theaterSlug },
      },
    });
    if (!room) throw new NotFoundException('Room not found');
    return room.room_id;
  }

  async findOne(theaterSlug: string, roomSlug: string, seatCode: string) {
    const roomId = await this.findRoomId(theaterSlug, roomSlug);
    const seat = await this.prisma.seat.findFirst({
      where: { seat_code: seatCode, room_id: roomId },
    });
    if (!seat) throw new NotFoundException('Seat not found');
    return seat;
  }

  async findAllInRoom(theaterSlug: string, roomSlug: string) {
    const roomId = await this.findRoomId(theaterSlug, roomSlug);
    return this.prisma.seat.findMany({ where: { room_id: roomId } });
  }

  async update(
    theaterSlug: string,
    roomSlug: string,
    seatCode: string,
    data: UpdateSeatDto,
  ) {
    const roomId = await this.findRoomId(theaterSlug, roomSlug);
    const seat = await this.prisma.seat.findFirst({
      where: { seat_code: seatCode, room_id: roomId },
    });
    if (!seat) throw new NotFoundException('Seat not found');

    return this.prisma.seat.update({
      where: { seat_id: seat.seat_id }, // update vẫn cần id
      data,
    });
  }

  async remove(theaterSlug: string, roomSlug: string, seatCode: string) {
    const roomId = await this.findRoomId(theaterSlug, roomSlug);
    const seat = await this.prisma.seat.findFirst({
      where: { seat_code: seatCode, room_id: roomId },
    });
    if (!seat) throw new NotFoundException('Seat not found');

    return this.prisma.seat.delete({ where: { seat_id: seat.seat_id } });
  }
}
