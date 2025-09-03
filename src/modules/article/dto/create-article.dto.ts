import { IsString } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  article_title: string;

  @IsString()
  article_slug: string;

  @IsString()
  article_thumbnail: string;

  @IsString()
  article_type: string;

  @IsString()
  article_content1: string;

  @IsString()
  article_image1: string;

  @IsString()
  article_content2: string;

  @IsString()
  article_image2: string;

  @IsString()
  article_content3: string;
}
