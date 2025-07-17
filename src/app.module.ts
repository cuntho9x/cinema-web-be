import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { MovieModule } from './modules/movie/movie.module';
// import { ProductModule } from './modules/product/product.module';
// import { TheaterModule } from './modules/theater/theater.module';
// import { BookingModule } from './modules/booking/booking.module';
// import { ArticleModule } from './article/article.module';
// import { PromotionModule } from './promotion/promotion.module';
// import { CinemaModule } from './cinema/cinema.module';
// import { RoomModule } from './room/room.module';
// import { SeatMapModule } from './seat-map/seat-map.module';
// import { SeatModule } from './seat/seat.module';
// import { ShowtimeModule } from './showtime/showtime.module';
// import { TicketModule } from './ticket/ticket.module';
// import { PaymentModule } from './payment/payment.module';
// import { ArticleModule } from './modules/article/article.module';
// import { PromotionModule } from './modules/promotion/promotion.module';
// import { CinemaModule } from './modules/cinema/cinema.module';
// import { RoomModule } from './modules/room/room.module';
// import { SeatMapModule } from './modules/seat-map/seat-map.module';
// import { SeatModule } from './modules/seat/seat.module';
// import { ShowtimeModule } from './modules/showtime/showtime.module';
// import { TicketModule } from './modules/ticket/ticket.module';
// import { PaymentModule } from './modules/payment/payment.module';
// import { FoodModule } from './modules/food/food.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST') ,
        port: Number(configService.get<string>('DB_PORT')) ,
        username: configService.get<string>('DB_USERNAME') ,
        password: configService.get<string>('DB_PASSWORD') ,
        database: configService.get<string>('DB_DATABASE') ,
        autoLoadEntities: true,
        synchronize: false,
        // dropSchema: false,
      }),
    }),

    AccountModule,
    AuthModule,
    MovieModule,
    // ProductModule,
    // TheaterModule,
    // BookingModule,
    // ArticleModule,
    // PromotionModule,
    // CinemaModule,
    // RoomModule,
    // SeatMapModule,
    // SeatModule,
    // ShowtimeModule,
    // TicketModule,
    // PaymentModule,
    // FoodModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
