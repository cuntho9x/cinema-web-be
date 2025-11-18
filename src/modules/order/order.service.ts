import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateOrderDto, SeatDto } from './dto/create-order.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: number, dto: CreateOrderDto) {
    try {
      // Validate showtime exists
      const showtime = await this.prisma.scheduleShowtime.findUnique({
        where: { id: dto.schedule_showtime_id },
        include: { room: true },
      });

      if (!showtime) {
        throw new NotFoundException(`Showtime with id ${dto.schedule_showtime_id} not found`);
      }

      // Validate seats exist and are available
      const seatCodes = dto.seats.map((s) => s.seat_code);
      const seats = await this.prisma.seat.findMany({
        where: {
          room_id: showtime.room_id,
          seat_code: { in: seatCodes },
        },
      });

      if (seats.length !== dto.seats.length) {
        throw new BadRequestException('Some seats not found');
      }

      // Kiểm tra xem ghế đã được đặt cho showtime này chưa
      const existingTickets = await this.prisma.ticket.findMany({
        where: {
          order: {
            schedule_showtime_id: dto.schedule_showtime_id,
            status: {
              in: ['PENDING', 'CONFIRMED', 'COMPLETED'],
            },
          },
          seat_id: { in: seats.map(s => s.seat_id) },
          status: {
            in: ['ACTIVE'],
          },
        },
        select: {
          seat_id: true,
        },
      });

      const bookedSeatIds = new Set(existingTickets.map(t => t.seat_id));
      const bookedSeats = seats.filter(s => bookedSeatIds.has(s.seat_id));
      
      if (bookedSeats.length > 0) {
        throw new BadRequestException(
          `Seats ${bookedSeats.map((s) => s.seat_code).join(', ')} are already booked for this showtime`
        );
      }

      // Kiểm tra ghế có bị hỏng không
      const unavailableSeats = seats.filter((s) => s.status === 'UNAVAILABLE');
      if (unavailableSeats.length > 0) {
        throw new BadRequestException(
          `Seats ${unavailableSeats.map((s) => s.seat_code).join(', ')} are unavailable`
        );
      }

      // Create order and tickets in a transaction
      return await this.prisma.$transaction(async (tx) => {
        // Prepare order data
        const orderData: any = {
          user_id: userId,
          schedule_showtime_id: dto.schedule_showtime_id,
          total_price: dto.total_price,
          discount: dto.discount,
          status: 'PENDING',
        };

        // Only add payment_method if it exists in DTO (will skip if column doesn't exist in DB)
        if (dto.payment_method) {
          orderData.payment_method = dto.payment_method;
        }

        // Create order
        const order = await tx.order.create({
          data: orderData,
        });

        // Create tickets for each seat
        const tickets = await Promise.all(
          dto.seats.map(async (seatDto) => {
            const seat = seats.find((s) => s.seat_code === seatDto.seat_code);
            if (!seat) {
              throw new BadRequestException(`Seat ${seatDto.seat_code} not found`);
            }

            // KHÔNG update seat status trong bảng Seat
            // Status của ghế sẽ được tính động dựa trên tickets cho showtime cụ thể
            // Ghế chỉ được đánh dấu SOLD cho showtime này, không ảnh hưởng showtime khác

            // Create ticket
            return await tx.ticket.create({
              data: {
                order_id: order.order_id,
                seat_id: seat.seat_id,
                price: seatDto.price,
                status: 'ACTIVE',
                ticket_code: `TICKET-${uuidv4().substring(0, 8).toUpperCase()}`,
              },
            });
          })
        );

        // Create order foods if provided
        let orderFoods: any[] = [];
        if (dto.foods && dto.foods.length > 0) {
          // Validate foods exist
          const foodIds = dto.foods.map(f => f.food_id);
          const foods = await tx.food.findMany({
            where: {
              food_id: { in: foodIds },
            },
          });

          if (foods.length !== foodIds.length) {
            throw new BadRequestException('Some foods not found');
          }

          // Create order foods
          orderFoods = await Promise.all(
            dto.foods.map(async (foodDto) => {
              return await (tx as any).orderFood.create({
                data: {
                  order_id: order.order_id,
                  food_id: foodDto.food_id,
                  quantity: foodDto.quantity,
                  price: foodDto.price,
                },
              });
            })
          );
        }

        return {
          order,
          tickets,
          orderFoods,
        };
      });
    } catch (error) {
      throw error;
    }
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

  // Get order details by order ID (for ticket modal)
  async getOrderDetails(userId: number, orderId: number) {
    const order = await this.prisma.order.findFirst({
      where: {
        order_id: orderId,
        user_id: userId, // Ensure user can only access their own orders
      },
      include: {
        scheduleShowtime: {
          include: {
            movie: {
              include: {
                movieGenres: {
                  include: {
                    genre: true,
                  },
                },
              },
            },
            theater: true,
            room: true,
          },
        },
        tickets: {
          include: {
            seat: true,
          },
        },
        orderFoods: {
          include: {
            food: true,
          },
        },
      } as any,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  // Get user statistics (RP points and total payment)
  async getUserStatistics(userId: number) {
    // Get all orders (including PENDING, CONFIRMED, COMPLETED)
    // PENDING orders are also counted as they represent money spent
    const allOrders = await this.prisma.order.findMany({
      where: {
        user_id: userId,
      },
      select: {
        total_price: true,
        discount: true,
        status: true,
      },
    });

    // console.log(`[getUserStatistics] User ID: ${userId}, Total orders: ${allOrders.length}`);
    // console.log(`[getUserStatistics] Orders by status:`, {
    //   PENDING: allOrders.filter(o => o.status === 'PENDING').length,
    //   CONFIRMED: allOrders.filter(o => o.status === 'CONFIRMED').length,
    //   COMPLETED: allOrders.filter(o => o.status === 'COMPLETED').length,
    //   CANCELLED: allOrders.filter(o => o.status === 'CANCELLED').length,
    // });

    // Calculate total payment (after discount) - exclude CANCELLED orders
    const validOrders = allOrders.filter(o => o.status !== 'CANCELLED');
    const totalPayment = validOrders.reduce((sum, order) => {
      return sum + (order.total_price - order.discount);
    }, 0);

    // Calculate RP points (1 point per 10,000 VND)
    const rpPoints = Math.floor(totalPayment / 10000);

    const result = {
      totalPayment,
      rpPoints,
      totalOrders: validOrders.length,
    };

    // console.log(`[getUserStatistics] Result:`, result);

    return result;
  }

  // Admin: Get all orders with optional filters
  async getAllOrders(theaterId?: number, orderDate?: string) {
    const where: any = {};

    // Filter by theater
    if (theaterId) {
      where.scheduleShowtime = {
        theater_id: theaterId,
      };
    }

    // Filter by order date
    if (orderDate) {
      // Parse date string directly (format: YYYY-MM-DD) to avoid timezone issues
      const [year, month, day] = orderDate.split('-').map(Number);
      if (year && month && day && !isNaN(year) && !isNaN(month) && !isNaN(day)) {
        // Create UTC dates to avoid timezone conversion issues
        const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
        const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
        
        where.order_date = {
          gte: startOfDay,
          lte: endOfDay,
        };
      }
    }

    return await this.prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            user_id: true,
            full_name: true,
            email: true,
            phone_number: true,
          },
        },
        scheduleShowtime: {
          include: {
            movie: {
              select: {
                movie_id: true,
                movie_title: true,
                movie_poster: true,
              },
            },
            theater: {
              select: {
                theater_id: true,
                theater_name: true,
              },
            },
            room: {
              select: {
                room_id: true,
                room_name: true,
                room_type: true,
              },
            },
          },
        },
        tickets: {
          include: {
            seat: {
              select: {
                seat_code: true,
                seat_type: true,
              },
            },
          },
        },
      },
      orderBy: { order_date: 'desc' },
    });
  }

  // Admin: Update order status
  async updateOrderStatus(orderId: number, status: string) {
    const order = await this.prisma.order.findUnique({
      where: { order_id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }

    return await this.prisma.order.update({
      where: { order_id: orderId },
      data: { status: status as any },
      include: {
        user: {
          select: {
            user_id: true,
            full_name: true,
            email: true,
            phone_number: true,
          },
        },
        scheduleShowtime: {
          include: {
            movie: {
              select: {
                movie_id: true,
                movie_title: true,
                movie_poster: true,
              },
            },
            theater: {
              select: {
                theater_id: true,
                theater_name: true,
              },
            },
            room: {
              select: {
                room_id: true,
                room_name: true,
                room_type: true,
              },
            },
          },
        },
        tickets: {
          include: {
            seat: {
              select: {
                seat_code: true,
                seat_type: true,
              },
            },
          },
        },
      },
    });
  }

  // Admin: Get order details by order ID (no user filter)
  async getOrderDetailsForAdmin(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: {
        order_id: orderId,
      },
      include: {
        user: {
          select: {
            user_id: true,
            full_name: true,
            email: true,
            phone_number: true,
            address: true,
          },
        },
        scheduleShowtime: {
          include: {
            movie: {
              include: {
                movieGenres: {
                  include: {
                    genre: true,
                  },
                },
              },
            },
            theater: true,
            room: true,
          },
        },
        tickets: {
          include: {
            seat: true,
          },
        },
        orderFoods: {
          include: {
            food: true,
          },
        },
      } as any,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  // Admin: Get dashboard statistics
  async getDashboardStatistics(month?: number, year?: number) {
    const now = new Date();
    const currentMonth = month || now.getMonth() + 1;
    const currentYear = year || now.getFullYear();
    
    // Start and end of the month
    const startOfMonth = new Date(Date.UTC(currentYear, currentMonth - 1, 1, 0, 0, 0, 0));
    // Get last day of month
    const lastDayOfMonth = new Date(currentYear, currentMonth, 0).getDate();
    const endOfMonth = new Date(Date.UTC(currentYear, currentMonth - 1, lastDayOfMonth, 23, 59, 59, 999));
    
    // Start and end of today
    const today = new Date();
    const startOfToday = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0));
    const endOfToday = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999));

    // Get all completed and confirmed orders for the month (exclude CANCELLED)
    const orders = await this.prisma.order.findMany({
      where: {
        order_date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        status: {
          in: ['PENDING', 'CONFIRMED', 'COMPLETED'],
        },
      },
      include: {
        scheduleShowtime: {
          include: {
            movie: {
              select: {
                movie_id: true,
                movie_title: true,
              },
            },
            theater: {
              select: {
                theater_id: true,
                theater_name: true,
              },
            },
          },
        },
        tickets: {
          select: {
            ticket_id: true,
          },
        },
      },
    });

    // Calculate today's revenue
    const todayOrders = orders.filter(order => {
      const orderDate = new Date(order.order_date);
      return orderDate >= startOfToday && orderDate <= endOfToday;
    });
    const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.total_price - order.discount), 0);

    // Calculate monthly revenue
    const monthlyRevenue = orders.reduce((sum, order) => sum + (order.total_price - order.discount), 0);

    // Calculate total tickets sold in month
    const totalTicketsSold = orders.reduce((sum, order) => sum + order.tickets.length, 0);

    // Calculate new customers (users who registered in this month)
    const startOfMonthForUsers = new Date(Date.UTC(currentYear, currentMonth - 1, 1, 0, 0, 0, 0));
    const lastDayOfMonthForUsers = new Date(currentYear, currentMonth, 0).getDate();
    const endOfMonthForUsers = new Date(Date.UTC(currentYear, currentMonth - 1, lastDayOfMonthForUsers, 23, 59, 59, 999));
    const newCustomers = await this.prisma.user.count({
      where: {
        created_at: {
          gte: startOfMonthForUsers,
          lte: endOfMonthForUsers,
        },
        role: 'customer',
      },
    });

    // Revenue by movie
    const revenueByMovie: { [key: number]: { movie_id: number; movie_title: string; revenue: number; tickets: number } } = {};
    orders.forEach(order => {
      const movie = order.scheduleShowtime.movie;
      if (!revenueByMovie[movie.movie_id]) {
        revenueByMovie[movie.movie_id] = {
          movie_id: movie.movie_id,
          movie_title: movie.movie_title,
          revenue: 0,
          tickets: 0,
        };
      }
      revenueByMovie[movie.movie_id].revenue += order.total_price - order.discount;
      revenueByMovie[movie.movie_id].tickets += order.tickets.length;
    });

    // Revenue by theater
    const revenueByTheater: { [key: number]: { theater_id: number; theater_name: string; revenue: number; tickets: number } } = {};
    orders.forEach(order => {
      const theater = order.scheduleShowtime.theater;
      if (!revenueByTheater[theater.theater_id]) {
        revenueByTheater[theater.theater_id] = {
          theater_id: theater.theater_id,
          theater_name: theater.theater_name,
          revenue: 0,
          tickets: 0,
        };
      }
      revenueByTheater[theater.theater_id].revenue += order.total_price - order.discount;
      revenueByTheater[theater.theater_id].tickets += order.tickets.length;
    });

    // Revenue by month (last 12 months)
    const revenueByMonth: { month: string; revenue: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(currentYear, currentMonth - 1 - i, 1);
      const monthStart = new Date(Date.UTC(monthDate.getFullYear(), monthDate.getMonth(), 1, 0, 0, 0, 0));
      const lastDayOfMonthForChart = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
      const monthEnd = new Date(Date.UTC(monthDate.getFullYear(), monthDate.getMonth(), lastDayOfMonthForChart, 23, 59, 59, 999));
      
      const monthOrders = await this.prisma.order.findMany({
        where: {
          order_date: {
            gte: monthStart,
            lte: monthEnd,
          },
          status: {
            in: ['PENDING', 'CONFIRMED', 'COMPLETED'],
          },
        },
        select: {
          total_price: true,
          discount: true,
        },
      });
      
      const monthRevenue = monthOrders.reduce((sum, order) => sum + (order.total_price - order.discount), 0);
      revenueByMonth.push({
        month: (monthDate.getMonth() + 1).toString(),
        revenue: monthRevenue,
      });
    }

    return {
      todayRevenue,
      monthlyRevenue,
      totalTicketsSold,
      newCustomers,
      revenueByMovie: Object.values(revenueByMovie).sort((a, b) => b.revenue - a.revenue),
      revenueByTheater: Object.values(revenueByTheater).sort((a, b) => b.revenue - a.revenue),
      revenueByMonth,
    };
  }
}
