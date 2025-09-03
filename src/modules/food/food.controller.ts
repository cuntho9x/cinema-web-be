import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    ParseIntPipe,
  } from '@nestjs/common';
  import { FoodService } from './food.service';
  import { CreateFoodDto } from './dto/create-food.dto';
  import { UpdateFoodDto } from './dto/update-food.dto';
  
  @Controller('food')
  export class FoodController {
    constructor(private readonly foodService: FoodService) {}
  
    @Post()
    create(@Body() dto: CreateFoodDto) {
      return this.foodService.create(dto);
    }
  
    @Get()
    findAll() {
      return this.foodService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.foodService.findOne(id);
    }
  
    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFoodDto) {
      return this.foodService.update(id, dto);
    }
  
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.foodService.remove(id);
    }
  }
  