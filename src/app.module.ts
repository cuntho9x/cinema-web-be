import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';

import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { MovieModule } from './modules/movie/movie.module';
import { FoodsModule } from './modules/food/food.module';
import { PromotionModule } from './modules/promotion/promotion.module';
import { TheaterModule } from './modules/theater/theater.module';
import { ArticleModule } from './modules/article/article.module';
import { RoomModule } from './modules/room/room.module';
import { SeatModule } from './modules/seat/seat.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { ScheduleListModule } from './modules/schedule-list/schedule-list.module';
import { ScheduleShowtimeModule } from './modules/schedule-showtime/schedule-showtime.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AccountModule,
    AuthModule,
    MovieModule,
    FoodsModule,  
    PromotionModule,
    TheaterModule,
    ArticleModule,
    RoomModule,
    SeatModule,
    TicketModule,
    ScheduleListModule,
    ScheduleShowtimeModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
