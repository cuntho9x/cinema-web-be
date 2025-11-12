import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MovieStatus } from '@prisma/client';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MovieService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMovieDto) {
    const {
      genreIds,
      release_date,
      ...rest
    } = dto;

    const movie = await this.prisma.movie.create({
      data: {
        ...rest,
        release_date: new Date(release_date),
        movieGenres: genreIds
          ? {
              create: genreIds.map((id) => ({ genre: { connect: { id } } })),
            }
          : undefined,
      },
      include: {
        movieGenres: {
          include: {
            genre: true,
          },
        },
      },
    });

    return movie;
  }


  async findAll(
    status?: string,
    search?: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const where: any = {};
    
    if (status) {
      where.status = status as MovieStatus;
    }
    
    // Tìm kiếm theo tên phim (partial match - chứa chuỗi con)
    // MySQL với collation utf8mb4_unicode_ci sẽ tự động case-insensitive
    if (search && search.trim()) {
      where.movie_title = {
        contains: search.trim(),
      };
    }
    
    // Tính toán skip và take cho phân trang
    const skip = (page - 1) * limit;
    const take = limit;

    // Lấy tổng số phim (để tính tổng số trang)
    const total = await this.prisma.movie.count({ where });

    // Lấy danh sách phim với phân trang
    const movies = await this.prisma.movie.findMany({ 
      where,
      include: {
        movieGenres: {
          include: {
            genre: true,
          },
        },
      },
      orderBy: {
        movie_title: 'asc', // Sắp xếp theo tên A-Z
      },
      skip,
      take,
    });

    // Tính tổng số trang
    const totalPages = Math.ceil(total / limit);

    return {
      movies,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  findOne(id: number) {
    return this.prisma.movie.findUnique({ 
      where: { movie_id: id },
      include: {
        movieGenres: {
          include: {
            genre: true,
          },
        },
      },
    });
  }

  findBySlug(slug: string) {
    return this.prisma.movie.findUnique({
      where: {
        movie_title_url: slug,
      },
      include: {
        movieGenres: {
          include: {
            genre: true,
          },
        },
      },
    });
  }

  async update(id: number, dto: UpdateMovieDto) {
    const movie = await this.prisma.movie.findUnique({ where: { movie_id: id } });
    if (!movie) throw new NotFoundException('Movie not found');

    const { genreIds, release_date, ...rest } = dto;

    // Xoá hết genre cũ rồi tạo lại nếu có genreIds
    if (genreIds) {
      await this.prisma.movieGenre.deleteMany({ where: { movieId: id } });
    }

    return this.prisma.movie.update({
      where: { movie_id: id },
      data: {
        ...rest,
        release_date: release_date ? new Date(release_date) : undefined,
        movieGenres: genreIds
          ? {
              create: genreIds.map((id) => ({ genre: { connect: { id } } })),
            }
          : undefined,
      },
      include: {
        movieGenres: {
          include: { genre: true },
        },
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.movie.findUnique({ where: { movie_id: id } });
    if (!existing) throw new NotFoundException('Movie not found');

    return this.prisma.movie.delete({ where: { movie_id: id } });
  }


  async findAllForSchedule() {
    return this.prisma.movie.findMany({
      select: {
        movie_id: true,
        movie_title: true
      },
      orderBy: {
        movie_title: 'asc'
      }
    });
  }

  async findAllGenres() {
    return this.prisma.genre.findMany({
      orderBy: {
        name: 'asc'
      }
    });
  }
  
}
