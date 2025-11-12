import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateScheduleShowtimeDto } from './dto/create-schedule-showtime.dto';

@Injectable()
export class ScheduleShowtimeService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateScheduleShowtimeDto) {
    return this.prisma.scheduleShowtime.create({ data });
  }

  findAll(theaterId?: number, roomId?: number, showDate?: string, movieId?: number) {
    const where: any = {};
    
    // Nếu có đủ 3 tham số (theaterId, roomId, showDate) → filter chặt chẽ (dùng cho admin portal)
    if (theaterId && roomId && showDate) {
      // Filter theo theater_id
      where.theater_id = theaterId;
      
      // Filter theo room_id
      where.room_id = roomId;
      
      // Filter theo showDate
      const [year, month, day] = showDate.split('-').map(Number);
      if (year && month && day && !isNaN(year) && !isNaN(month) && !isNaN(day)) {
        const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
        const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
        
        where.show_date = {
          gte: startOfDay,
          lte: endOfDay,
        };
      }
    } else if (movieId) {
      // Nếu chỉ có movieId → filter theo movie (dùng cho frontend movie detail page)
      where.movie_id = movieId;
    }
    // Nếu không có tham số nào → trả về tất cả (có thể dùng để debug hoặc admin)
    
    return this.prisma.scheduleShowtime.findMany({
      where,
      include: { 
        movie: {
          select: {
            movie_id: true,
            movie_title: true,
            movie_poster: true,
            duration: true,
          }
        }, 
        theater: {
          select: {
            theater_id: true,
            theater_name: true,
          }
        }, 
        room: {
          select: {
            room_id: true,
            room_name: true,
            room_type: true,
          }
        }
      },
      orderBy: [
        { show_date: 'asc' },
        { start_time: 'asc' },
      ],
    });
  }

  findOne(id: number) {
    return this.prisma.scheduleShowtime.findUnique({
      where: { id },
      include: { movie: true, theater: true, room: true },
    });
  }

  remove(id: number) {
    return this.prisma.scheduleShowtime.delete({ where: { id } });
  }

  async getSeatsByShowtimeId(id: number) {
    try {
      const showtime = await this.prisma.scheduleShowtime.findUnique({
        where: { id },
        select: {
          id: true,
          room_id: true,
          room: {
            select: {
              room_id: true,
              room_name: true,
            },
          },
        },
      });

      if (!showtime) {
        throw new NotFoundException(`Showtime with id ${id} not found`);
      }

      if (!showtime.room) {
        throw new NotFoundException(`Room not found for showtime ${id}. Room ID: ${showtime.room_id}`);
      }

      // Lấy tất cả ghế trong phòng
      const seats = await this.prisma.seat.findMany({
        where: { room_id: showtime.room_id },
        orderBy: [
          { row_label: 'asc' },
          { column_number: 'asc' },
        ],
      });

      // Lấy danh sách ghế đã được đặt cho showtime CỤ THỂ này
      // CHỈ lấy tickets có order với schedule_showtime_id = id (showtime hiện tại)
      const soldSeatIds = await this.prisma.ticket.findMany({
        where: {
          order: {
            schedule_showtime_id: id, // QUAN TRỌNG: chỉ lấy tickets của showtime này
            status: {
              in: ['PENDING', 'CONFIRMED', 'COMPLETED'], // Chỉ tính các order hợp lệ
            },
          },
          status: {
            in: ['ACTIVE'], // Chỉ tính các ticket còn hiệu lực
          },
        },
        select: {
          seat_id: true,
        },
      });

      const soldSeatIdSet = new Set(soldSeatIds.map(t => t.seat_id));

      // Map seats và đánh dấu status dựa trên tickets của showtime này
      const seatsWithStatus = seats.map(seat => {
        // Nếu ghế đã có ticket cho showtime này → SOLD
        // Nếu ghế bị hỏng trong database → UNAVAILABLE
        // Ngược lại → AVAILABLE
        
        // Kiểm tra xem ghế này có ticket cho showtime hiện tại không
        const isSoldForThisShowtime = soldSeatIdSet.has(seat.seat_id);
        
        // Kiểm tra ghế có bị hỏng không (từ database)
        const isUnavailable = seat.status === 'UNAVAILABLE';
        
        let finalStatus: 'AVAILABLE' | 'SOLD' | 'UNAVAILABLE';
        
        if (isUnavailable) {
          finalStatus = 'UNAVAILABLE';
        } else if (isSoldForThisShowtime) {
          finalStatus = 'SOLD';
        } else {
          finalStatus = 'AVAILABLE';
        }

        return {
          ...seat,
          status: finalStatus,
        };
      });

      return seatsWithStatus;
    } catch (error) {
      throw error;
    }
  }
}
