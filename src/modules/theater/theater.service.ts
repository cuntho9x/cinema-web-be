import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';

@Injectable()
export class TheaterService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTheaterDto: CreateTheaterDto) {
    return this.prisma.theater.create({
      data: createTheaterDto,
    });
  }

  async findAll() {
    return this.prisma.theater.findMany();
  }

  async findOne(slug: string) {
    return this.prisma.theater.findUnique({
      where: { theater_title_url: slug },
    });
  }
  
  async update(slug: string, updateTheaterDto: UpdateTheaterDto) {
    return this.prisma.theater.update({
      where: { theater_title_url: slug },
      data: updateTheaterDto,
    });
  }
  
  async remove(slug: string) {
    return this.prisma.theater.delete({
      where: { theater_title_url: slug },
    });
  }
  
}
