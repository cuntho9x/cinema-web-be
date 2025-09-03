import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateScheduleListDto } from './dto/create-schedule-list.dto';

@Injectable()
export class ScheduleListService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateScheduleListDto) {
    return this.prisma.scheduleList.create({ data });
  }

  findAll() {
    return this.prisma.scheduleList.findMany({
      include: { movie: true },
    });
  }

  findOne(id: number) {
    return this.prisma.scheduleList.findUnique({
      where: { id },
      include: { movie: true },
    });
  }

  remove(id: number) {
    return this.prisma.scheduleList.delete({ where: { id } });
  }
}
