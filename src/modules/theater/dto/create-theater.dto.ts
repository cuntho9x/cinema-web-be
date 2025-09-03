import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTheaterDto {
  @IsString()
  @IsNotEmpty()
  theater_name: string;

  @IsString()
  @IsNotEmpty()
  theater_address: string;

  @IsString()
  @IsNotEmpty()
  theater_phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  theater_title_url: string;

  @IsString()
  @IsNotEmpty()
  map_url: string;
}
