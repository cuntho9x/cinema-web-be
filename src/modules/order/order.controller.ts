import { Controller, Post, Get, Body, UseGuards, Req, Param, ParseIntPipe, Patch, Query } from '@nestjs/common';
import { Request } from 'express';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@Req() req: Request, @Body() dto: CreateOrderDto) {
    // req.user được gán bởi JwtStrategy.validate
    const user = req.user as any;
    if (!user || !user.user_id) {
      throw new Error('User not authenticated');
    }

    return await this.orderService.createOrder(user.user_id, dto);
  }

  // Routes cụ thể phải đặt TRƯỚC route có parameter để tránh conflict
  // Statistics route
  @UseGuards(JwtAuthGuard)
  @Get('statistics')
  async getStatistics(@Req() req: Request) {
    const user = req.user as any;
    if (!user || !user.user_id) {
      throw new Error('User not authenticated');
    }

    return await this.orderService.getUserStatistics(user.user_id);
  }

  // My orders route
  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  async getMyOrders(@Req() req: Request) {
    const user = req.user as any;
    if (!user || !user.user_id) {
      throw new Error('User not authenticated');
    }

    return await this.orderService.getUserOrders(user.user_id);
  }

  // Admin routes - must be BEFORE :orderId route
  // Use 'all' instead of 'admin/all' to avoid routing conflicts
  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAllOrders(
    @Req() req: Request,
    @Query('theaterId') theaterId?: string,
    @Query('orderDate') orderDate?: string,
  ) {
    const user = req.user as any;
    if (!user || !user.user_id) {
      throw new Error('User not authenticated');
    }
    // TODO: Add admin role check if needed
    // if (user.role !== 'admin') {
    //   throw new ForbiddenException('Admin access required');
    // }

    const parsedTheaterId = theaterId && theaterId.trim() !== '' ? parseInt(theaterId, 10) : undefined;
    const parsedOrderDate = orderDate && orderDate.trim() !== '' ? orderDate : undefined;

    return await this.orderService.getAllOrders(parsedTheaterId, parsedOrderDate);
  }

  // Update order status - must be BEFORE :orderId route
  @UseGuards(JwtAuthGuard)
  @Patch('status/:orderId')
  async updateOrderStatus(
    @Req() req: Request,
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    const user = req.user as any;
    if (!user || !user.user_id) {
      throw new Error('User not authenticated');
    }
    // TODO: Add admin role check if needed
    // if (user.role !== 'admin') {
    //   throw new ForbiddenException('Admin access required');
    // }

    return await this.orderService.updateOrderStatus(orderId, dto.status);
  }

  // Admin route for order details - use 'detail/:orderId' to avoid conflict with user route
  @UseGuards(JwtAuthGuard)
  @Get('detail/:orderId')
  async getOrderDetailsForAdmin(@Req() req: Request, @Param('orderId', ParseIntPipe) orderId: number) {
    const user = req.user as any;
    if (!user || !user.user_id) {
      throw new Error('User not authenticated');
    }
    // TODO: Add admin role check if needed
    // if (user.role !== 'admin') {
    //   throw new ForbiddenException('Admin access required');
    // }

    return await this.orderService.getOrderDetailsForAdmin(orderId);
  }

  // Admin: Get dashboard statistics
  @UseGuards(JwtAuthGuard)
  @Get('dashboard/stats')
  async getDashboardStatistics(
    @Req() req: Request,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    const user = req.user as any;
    if (!user || !user.user_id) {
      throw new Error('User not authenticated');
    }

    const parsedMonth = month && month.trim() !== '' ? parseInt(month, 10) : undefined;
    const parsedYear = year && year.trim() !== '' ? parseInt(year, 10) : undefined;
    return await this.orderService.getDashboardStatistics(parsedMonth, parsedYear);
  }

  // Order details route - phải đặt SAU các routes cụ thể
  @UseGuards(JwtAuthGuard)
  @Get(':orderId')
  async getOrderDetails(@Req() req: Request, @Param('orderId', ParseIntPipe) orderId: number) {
    const user = req.user as any;
    if (!user || !user.user_id) {
      throw new Error('User not authenticated');
    }

    return await this.orderService.getOrderDetails(user.user_id, orderId);
  }
}
