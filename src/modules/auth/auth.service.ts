import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  // Get user by ID with full info including avatar
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

  async register(dto: any) {
    const hash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        full_name: dto.full_name,
        email: dto.email,
        hash_password: hash,
        phone_number: dto.phone_number,
        gender: dto.gender.toLowerCase(),
        birthday: new Date(dto.birthday),
        address: dto.address,
        role: 'customer',
        avatar_img: '/default-avatar.png',
        created_at: new Date(),
        registered_at: new Date(),
      },
    });

    return { message: 'Đăng ký thành công', user };
  }

  async login(dto: any, res: Response): Promise<{ message: string; access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.hash_password))) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const payload = { sub: user.user_id, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('EXPIRE_TIME') || '7d',
    });

    res.cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // đổi thành true nếu dùng HTTPS
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    return {
      message: 'Đăng nhập thành công',
      access_token: token,
    };
  }

  // hàm logout
  logout(res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
    });

    return { message: 'Đăng xuất thành công' };
  }

  // Đăng ký admin - đơn giản như register customer nhưng role là admin
  async registerAdmin(dto: any) {
    const hash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        full_name: dto.full_name,
        email: dto.email,
        hash_password: hash,
        phone_number: dto.phone_number,
        gender: dto.gender.toLowerCase(),
        birthday: new Date(dto.birthday),
        address: dto.address,
        role: 'admin', // Tạo với role admin
        avatar_img: '/user/default-avatar.png',
        created_at: new Date(),
        registered_at: new Date(),
      },
    });

    return { message: 'Đăng ký admin thành công', user };
  }
}
