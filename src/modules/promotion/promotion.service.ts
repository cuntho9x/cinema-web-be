import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PromotionService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.PromotionCreateInput) {
    return this.prisma.promotion.create({ data });
  }

  findAll() {
    return this.prisma.promotion.findMany();
  }

  findOne(id: number) {
    return this.prisma.promotion.findUnique({
      where: { promotions_id: id },
    });
  }

  async update(id: number, data: Prisma.PromotionUpdateInput) {
    const existing = await this.findOne(id);
    if (!existing) throw new NotFoundException('Promotion not found');
    return this.prisma.promotion.update({
      where: { promotions_id: id },
      data,
    });
  }

  async remove(id: number) {
    const existing = await this.findOne(id);
    if (!existing) throw new NotFoundException('Promotion not found');
    return this.prisma.promotion.delete({
      where: { promotions_id: id },
    });
  }
}
