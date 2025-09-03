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


  findAll(status?: string) {
    const where = status ? { status: status as MovieStatus } : {};
    return this.prisma.movie.findMany({ where });
  }

  findOne(id: number) {
    return this.prisma.movie.findUnique({ where: { movie_id: id } });
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
  
}
