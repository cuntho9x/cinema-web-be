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
  import { PromotionService } from './promotion.service';
  import { Prisma } from '@prisma/client';
  
  @Controller('promotion')
  export class PromotionController {
    constructor(private readonly promotionService: PromotionService) {}
  
    @Post()
    create(@Body() data: Prisma.PromotionCreateInput) {
      return this.promotionService.create(data);
    }
  
    @Get()
    findAll() {
      return this.promotionService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.promotionService.findOne(id);
    }
  
    @Put(':id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() data: Prisma.PromotionUpdateInput,
    ) {
      return this.promotionService.update(id, data);
    }
  
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.promotionService.remove(id);
    }
  }
  