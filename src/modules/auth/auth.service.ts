import { Injectable, UnauthorizedException } from '@nestjs/common';
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
}
