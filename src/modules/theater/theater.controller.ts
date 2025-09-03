import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TheaterService } from './theater.service';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';

@Controller('theaters')
export class TheaterController {
  constructor(private readonly theaterService: TheaterService) {}

  @Post()
  create(@Body() createTheaterDto: CreateTheaterDto) {
    return this.theaterService.create(createTheaterDto);
  }

  @Get()
  findAll() {
    return this.theaterService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.theaterService.findOne(slug);
  }

  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() updateTheaterDto: UpdateTheaterDto) {
    return this.theaterService.update(slug, updateTheaterDto);
  }

  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.theaterService.remove(slug);
  }
}
