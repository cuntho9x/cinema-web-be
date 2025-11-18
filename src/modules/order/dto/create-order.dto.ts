import { IsInt, IsArray, IsString, Min, IsEnum, IsOptional } from 'class-validator';

export class SeatDto {
  @IsString()
  seat_code: string;

  @IsInt()
  @Min(0)
  price: number;
}

export class FoodDto {
  @IsInt()
  food_id: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsInt()
  @Min(0)
  price: number;
}

export enum PaymentMethod {
  VNPAY = 'VNPAY',
  MOMO = 'MoMo',
  ZALOPAY = 'ZaloPay',
  SHOPEEPAY = 'ShopeePay',
}

export class CreateOrderDto {
  @IsInt()
  schedule_showtime_id: number;

  @IsArray()
  seats: SeatDto[];

  @IsArray()
  @IsOptional()
  foods?: FoodDto[]; // Danh sách combo/food đã đặt

  @IsInt()
  @Min(0)
  total_price: number;

  @IsInt()
  @Min(0)
  discount: number;

  @IsString()
  @IsOptional()
  payment_method?: string;
}

