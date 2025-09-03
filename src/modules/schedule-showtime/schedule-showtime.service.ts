import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateScheduleShowtimeDto } from './dto/create-schedule-showtime.dto';

@Injectable()
export class ScheduleShowtimeService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateScheduleShowtimeDto) {
    return this.prisma.scheduleShowtime.create({ data });
  }

  findAll() {
    return this.prisma.scheduleShowtime.findMany({
      include: { movie: true, theater: true, room: true },
    });
  }

  findOne(id: number) {
    return this.prisma.scheduleShowtime.findUnique({
      where: { id },
      include: { movie: true, theater: true, room: true },
    });
  }

  remove(id: number) {
    return this.prisma.scheduleShowtime.delete({ where: { id } });
  }
}
