import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';

@Injectable()
export class FoodService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateFoodDto) {
    return this.prisma.food.create({ data });
  }

  findAll() {
    return this.prisma.food.findMany();
  }

  findOne(id: number) {
    return this.prisma.food.findUnique({ where: { food_id: id } });
  }

  async update(id: number, data: UpdateFoodDto) {
    const existing = await this.prisma.food.findUnique({ where: { food_id: id } });
    if (!existing) throw new NotFoundException('Food not found');

    return this.prisma.food.update({ where: { food_id: id }, data });
  }

  async remove(id: number) {
    const existing = await this.prisma.food.findUnique({ where: { food_id: id } });
    if (!existing) throw new NotFoundException('Food not found');

    return this.prisma.food.delete({ where: { food_id: id } });
  }
}
