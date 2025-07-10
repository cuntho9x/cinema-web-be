import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { MovieModule } from './modules/movie/movie.module';
import { ProductModule } from './modules/product/product.module';
import { TheaterModule } from './modules/theater/theater.module';
import { BookingModule } from './modules/booking/booking.module';

import { User } from './modules/account/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'daicathang',
      database: 'cinema_web',
      entities: [User],
      synchronize: true,
    }),
    AccountModule,
    AuthModule,
    MovieModule,
    ProductModule,
    TheaterModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
