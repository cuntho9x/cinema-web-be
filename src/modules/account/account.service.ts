import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async getAllAccounts() {
    return this.prisma.user.findMany({
      select: {
        user_id: true,
        full_name: true,
        email: true,
        phone_number: true,
        role: true,
        avatar_img: true,
        created_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    }); 
  }

  async getUserById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        full_name: true,
        email: true,
        phone_number: true,
        gender: true,
        birthday: true,
        address: true,
        role: true,
        avatar_img: true,
        created_at: true,
        registered_at: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(userId: number, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { user_id: userId },
      data: {
        ...(dto.full_name && { full_name: dto.full_name }),
        ...(dto.phone_number && { phone_number: dto.phone_number }),
        ...(dto.gender && { gender: dto.gender }),
        ...(dto.birthday && { birthday: new Date(dto.birthday) }),
        ...(dto.address && { address: dto.address }),
        ...(dto.avatar_img && { avatar_img: dto.avatar_img }),
        ...(dto.role && { role: dto.role }),
      },
      select: {
        user_id: true,
        full_name: true,
        email: true,
        phone_number: true,
        gender: true,
        birthday: true,
        address: true,
        role: true,
        avatar_img: true,
        created_at: true,
        registered_at: true,
      },
    });

    return updatedUser;
  }

  async getUserOrders(userId: number) {
    return await this.prisma.order.findMany({
      where: { user_id: userId },
      include: {
        scheduleShowtime: {
          include: {
            movie: true,
            theater: true,
            room: true,
          },
        },
        tickets: {
          include: {
            seat: true,
          },
        },
      },
      orderBy: { order_date: 'desc' },
    });
  }
}
