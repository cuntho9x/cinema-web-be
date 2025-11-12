import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
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

  // Routes with 'id/' must come before routes with ':slug' to avoid conflicts
  @Get('id/:id')
  findOneById(@Param('id', ParseIntPipe) id: number) {
    return this.theaterService.findOneById(id);
  }

  @Patch('id/:id')
  updateById(@Param('id', ParseIntPipe) id: number, @Body() updateTheaterDto: UpdateTheaterDto) {
    return this.theaterService.updateById(id, updateTheaterDto);
  }

  @Delete('id/:id')
  removeById(@Param('id', ParseIntPipe) id: number) {
    return this.theaterService.removeById(id);
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
