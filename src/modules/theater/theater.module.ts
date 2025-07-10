import { Module } from '@nestjs/common';
import { TheaterController } from './theater.controller';
import { TheaterService } from './theater.service';

@Module({
  controllers: [TheaterController],
  providers: [TheaterService],
})
export class TheaterModule {}
