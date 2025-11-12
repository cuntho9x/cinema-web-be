import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController, RoomByIdController } from './room.controller';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Module({
  controllers: [RoomController, RoomByIdController],
  providers: [RoomService, PrismaService],
})
export class RoomModule {}
