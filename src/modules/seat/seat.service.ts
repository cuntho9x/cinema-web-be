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

  async getAllSeatPrices() {
    return this.prisma.seatPrice.findMany({
      orderBy: { seat_type: 'asc' },
    });
  }

  async updateMany(
    theaterSlug: string,
    roomSlug: string,
    updates: Array<{ seatCode: string; seat_type?: string; status?: string }>,
  ) {
    const roomId = await this.findRoomId(theaterSlug, roomSlug);
    const results: Array<{
      seatCode: string;
      success: boolean;
      data?: any;
      error?: string;
    }> = [];
    
    for (const update of updates) {
      const seat = await this.prisma.seat.findFirst({
        where: { seat_code: update.seatCode, room_id: roomId },
      });
      
      if (!seat) {
        results.push({ seatCode: update.seatCode, success: false, error: 'Seat not found' });
        continue;
      }

      const updateData: any = {};
      if (update.seat_type !== undefined && update.seat_type !== null) {
        updateData.seat_type = update.seat_type;
      }
      if (update.status !== undefined && update.status !== null) {
        updateData.status = update.status;
      }

      if (Object.keys(updateData).length > 0) {
        try {
          const updated = await this.prisma.seat.update({
            where: { seat_id: seat.seat_id },
            data: updateData,
          });
          results.push({ seatCode: update.seatCode, success: true, data: updated });
        } catch (error: any) {
          results.push({ seatCode: update.seatCode, success: false, error: error.message });
        }
      } else {
        results.push({ seatCode: update.seatCode, success: false, error: 'No data to update' });
      }
    }

    return results;
  }
}
