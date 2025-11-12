import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.prisma.theater.findMany({
      orderBy: {
        theater_name: 'asc',
      },
    });
  }

  async findOneById(id: number) {
    const theater = await this.prisma.theater.findUnique({
      where: { theater_id: id },
    });
    if (!theater) {
      throw new NotFoundException(`Theater with ID ${id} not found`);
    }
    return theater;
  }

  async findOne(slug: string) {
    return this.prisma.theater.findUnique({
      where: { theater_title_url: slug },
    });
  }
  
  async updateById(id: number, updateTheaterDto: UpdateTheaterDto) {
    const existing = await this.prisma.theater.findUnique({
      where: { theater_id: id },
    });
    if (!existing) {
      throw new NotFoundException(`Theater with ID ${id} not found`);
    }
    return this.prisma.theater.update({
      where: { theater_id: id },
      data: updateTheaterDto,
    });
  }

  async update(slug: string, updateTheaterDto: UpdateTheaterDto) {
    return this.prisma.theater.update({
      where: { theater_title_url: slug },
      data: updateTheaterDto,
    });
  }

  async removeById(id: number) {
    const existing = await this.prisma.theater.findUnique({
      where: { theater_id: id },
    });
    if (!existing) {
      throw new NotFoundException(`Theater with ID ${id} not found`);
    }
    return this.prisma.theater.delete({
      where: { theater_id: id },
    });
  }
  
  async remove(slug: string) {
    return this.prisma.theater.delete({
      where: { theater_title_url: slug },
    });
  }
  
}
