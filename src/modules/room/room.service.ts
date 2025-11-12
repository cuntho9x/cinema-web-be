import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { SeatType, SeatStatus, Prisma } from '@prisma/client';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async create(theaterSlug: string, data: CreateRoomDto) {
    const theater = await this.prisma.theater.findUnique({
      where: { theater_title_url: theaterSlug },
    });
    if (!theater) throw new NotFoundException('Theater not found');

    // Loại bỏ theater_id từ data (nếu có) vì đã lấy từ theaterSlug
    const { theater_id, ...roomData } = data;
    const rowCount = roomData.row;
    const columnCount = roomData.column;

    // Dùng trực tiếp room_slug từ data
    const room = await this.prisma.room.create({
      data: {
        ...roomData,
        theater_id: theater.theater_id,
      },
    });

    // tạo ghế, khai báo rõ kiểu để tránh lỗi
    const seatsData: Prisma.SeatCreateManyInput[] = [];
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      const rowLabel = String.fromCharCode(65 + rowIndex);
      for (let col = 1; col <= columnCount; col++) {
        seatsData.push({
          room_id: room.room_id,
          row_label: rowLabel,
          column_number: col,
          seat_code: `${rowLabel}${col}`,
          seat_type: SeatType.STANDARD,
          status: SeatStatus.AVAILABLE,
        });
      }
    }
    await this.prisma.seat.createMany({ data: seatsData });

    return this.prisma.room.findUnique({
      where: { room_id: room.room_id },
      include: { seats: true },
    });
  }

  async findAllInTheater(theaterSlug: string) {
    const theater = await this.prisma.theater.findUnique({
      where: { theater_title_url: theaterSlug },
      include: { rooms: true },
    });
    if (!theater) throw new NotFoundException('Theater not found');
    return theater.rooms;
  }

  async findAllInTheaterById(theaterId: number) {
    const theater = await this.prisma.theater.findUnique({
      where: { theater_id: theaterId },
      include: { 
        rooms: {
          orderBy: {
            room_name: 'asc',
          },
        },
      },
    });
    if (!theater) throw new NotFoundException('Theater not found');
    return theater.rooms;
  }

  async findOne(theaterSlug: string, roomSlug: string) {
    const room = await this.prisma.room.findFirst({
      where: {
        room_slug: roomSlug,
        theater: { theater_title_url: theaterSlug },
      },
      include: { theater: true, seats: true },
    });
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async update(theaterSlug: string, roomSlug: string, data: UpdateRoomDto) {
    const room = await this.prisma.room.findFirst({
      where: {
        room_slug: roomSlug,
        theater: { theater_title_url: theaterSlug },
      },
      include: { seats: true },
    });
    if (!room) throw new NotFoundException('Room not found');

    // Check if rows or columns changed
    const rowsChanged = data.row !== undefined && data.row !== room.row;
    const colsChanged = data.column !== undefined && data.column !== room.column;

    // If rows or columns changed, we need to recreate seats
    if (rowsChanged || colsChanged) {
      const newRows = data.row ?? room.row;
      const newCols = data.column ?? room.column;

      // Delete all existing seats
      await this.prisma.seat.deleteMany({ where: { room_id: room.room_id } });

      // Create new seats
      const seatsData: Prisma.SeatCreateManyInput[] = [];
      for (let rowIndex = 0; rowIndex < newRows; rowIndex++) {
        const rowLabel = String.fromCharCode(65 + rowIndex);
        for (let col = 1; col <= newCols; col++) {
          seatsData.push({
            room_id: room.room_id,
            row_label: rowLabel,
            column_number: col,
            seat_code: `${rowLabel}${col}`,
            seat_type: SeatType.STANDARD,
            status: SeatStatus.AVAILABLE,
          });
        }
      }
      await this.prisma.seat.createMany({ data: seatsData });
    }

    return this.prisma.room.update({
      where: { room_id: room.room_id },
      data,
      include: { seats: true },
    });
  }

  async remove(theaterSlug: string, roomSlug: string) {
    const room = await this.prisma.room.findFirst({
      where: {
        room_slug: roomSlug,
        theater: { theater_title_url: theaterSlug },
      },
    });
    if (!room) throw new NotFoundException('Room not found');

    await this.prisma.seat.deleteMany({ where: { room_id: room.room_id } });
    await this.prisma.scheduleShowtime.deleteMany({ where: { room_id: room.room_id } });

    return this.prisma.room.delete({ where: { room_id: room.room_id } });
  }
}
