import {
    IsString,
    IsOptional,
    IsInt,
    IsEnum,
    IsDateString,
    IsArray,
  } from 'class-validator';
  import {
    MovieStatus,
    Country,
    GraphicsType,
    TranslationType,
    AgeRestriction,
  } from '@prisma/client';
  
  export class CreateMovieDto {
    @IsString()
    movie_title: string;
  
    @IsString()
    movie_title_url: string;
  
    @IsOptional()
    @IsString()
    movie_poster?: string;
  
    @IsOptional()
    @IsString()
    movie_trailer?: string;
  
    @IsInt()
    duration: number;
  
    @IsDateString()
    release_date: string;
  
    @IsOptional()
    @IsString()
    movie_review?: string;
  
    @IsEnum(Country)
    country: Country;
  
    @IsString()
    movie_producer: string;
  
    @IsOptional()
    @IsString()
    directors?: string;
  
    @IsOptional()
    @IsString()
    cast?: string;
  
    @IsOptional()
    @IsString()
    movie_description?: string;
  
    @IsEnum(MovieStatus)
    status: MovieStatus;
  
    @IsEnum(GraphicsType)
    graphics_type: GraphicsType;
  
    @IsEnum(TranslationType)
    translation_type: TranslationType;
  
    @IsEnum(AgeRestriction)
    age_restriction: AgeRestriction;
  
    @IsOptional()
    @IsArray()
    genreIds?: number[];
  }
  