// src/modules/account/account.controller.ts
import { 
  Controller, 
  Get, 
  Put, 
  Post,
  Body, 
  UseGuards, 
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Param,
  ParseIntPipe
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Request } from 'express';
import * as fs from 'fs';
import { AccountService } from './account.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('account') 
export class AccountController {
  constructor(private accountService: AccountService) {}

  // Upload avatar - đặt trước tất cả routes để tránh conflict
  @UseGuards(JwtAuthGuard)
  @Post('me/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          // Lưu vào fe/public/user thay vì be/public/user
          const fePublicUserPath = join(process.cwd(), '..', 'fe', 'public', 'user');
          cb(null, fePublicUserPath);
        },
        filename: (req, file, cb) => {
          const user = (req as any).user;
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `user-${user.user_id}-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new BadRequestException('Chỉ chấp nhận file ảnh (jpg, jpeg, png, gif)'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1024 * 1024, // 1MB
      },
    }),
  )
  async uploadAvatar(@Req() req: Request, @UploadedFile() file: any) {
    const user = req.user as any;
    if (!user || !user.user_id) {
      throw new Error('User not authenticated');
    }

    if (!file) {
      throw new BadRequestException('Vui lòng chọn file ảnh');
    }

    // Đảm bảo folder fe/public/user tồn tại
    const fePublicUserPath = join(process.cwd(), '..', 'fe', 'public', 'user');
    if (!fs.existsSync(fePublicUserPath)) {
      fs.mkdirSync(fePublicUserPath, { recursive: true });
    }

    // Đường dẫn tương đối để lưu vào database (chỉ tên file, frontend sẽ tự thêm /user/)
    const avatarPath = file.filename;
    
    // Cập nhật avatar_img trong database
    const updatedUser = await this.accountService.updateUser(user.user_id, {
      avatar_img: avatarPath,
    });

    return {
      message: 'Upload avatar thành công',
      avatar_url: avatarPath,
      user: updatedUser,
    };
  }

  // Lấy thông tin user hiện tại - đặt sau POST me/avatar
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyInfo(@Req() req: Request) {
    const user = req.user as any;
    if (!user || !user.user_id) {
      throw new Error('User not authenticated');
    }
    return this.accountService.getUserById(user.user_id);
  }

  // Cập nhật thông tin user hiện tại
  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateMyInfo(@Req() req: Request, @Body() dto: UpdateUserDto) {
    const user = req.user as any;
    if (!user || !user.user_id) {
      throw new Error('User not authenticated');
    }
    return this.accountService.updateUser(user.user_id, dto);
  }

  // Lấy tất cả accounts (admin) - đặt route cụ thể trước route có parameter
  @UseGuards(JwtAuthGuard)
  @Get('all')
  getAllAccounts() {
    return this.accountService.getAllAccounts(); 
  }

  // Lấy orders của user (admin) - phải đặt trước GET /account/:userId
  @UseGuards(JwtAuthGuard)
  @Get(':userId/orders')
  async getUserOrders(@Req() req: Request, @Param('userId', ParseIntPipe) userId: number) {
    return this.accountService.getUserOrders(userId);
  }

  // Lấy thông tin user theo ID (admin)
  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async getUserById(@Req() req: Request, @Param('userId', ParseIntPipe) userId: number) {
    return this.accountService.getUserById(userId);
  }

  // Cập nhật user theo ID (admin) - chỉ cho phép update role
  @UseGuards(JwtAuthGuard)
  @Put(':userId')
  async updateUserById(
    @Req() req: Request,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.accountService.updateUser(userId, dto);
  }
}

