import {
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsString,
  IsDateString,
  Length,
  Matches
} from 'class-validator';
import { Gender } from '@prisma/client'; // Enum: 'male' | 'female' | 'other'

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @IsNotEmpty()
  @Matches(/^\d{9,11}$/, {
    message: 'Số điện thoại phải từ 9 đến 11 chữ số'
  })
  phone_number: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsDateString({}, { message: 'Ngày sinh không hợp lệ (định dạng yyyy-MM-dd)' })
  birthday: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
