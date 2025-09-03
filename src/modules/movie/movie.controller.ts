import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  create(@Body() dto: CreateMovieDto) {
    return this.movieService.create(dto);
  }

  @Get()
  findAll(@Query('status') status?: string) {
    return this.movieService.findAll(status);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.movieService.findBySlug(slug);
  }

  @Get('id/:id') // đổi lại route để không bị xung đột với slug
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.movieService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMovieDto,
  ) {
    return this.movieService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.movieService.remove(id);
  }


//lấy title cho schedule
  @Get('all-for-schedule')
  findAllForSchedule() {
    return this.movieService.findAllForSchedule();
  }

}
