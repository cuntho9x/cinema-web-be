// src/foods/dto/create-food.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateFoodDto {
  @IsString() @IsOptional()
  food_img?: string;

  @IsString() @IsNotEmpty()
  food_name: string;

  @IsString() @IsOptional()
  food_description?: string;

  @IsNumber()
  food_price: number;
}
