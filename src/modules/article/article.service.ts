import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateArticleDto) {
    return this.prisma.article.create({ data: dto });
  }

  findAll() {
    return this.prisma.article.findMany();
  }

  findOne(id: number) {
    return this.prisma.article.findUnique({
      where: { article_id: id }, // ⛔ id ở đây có thể là undefined hoặc NaN
    });
  }

  findBySlug(slug: string) {
    return this.prisma.article.findUnique({
      where: {
        article_slug : slug,
      },
    });
  }  

  update(id: number, dto: UpdateArticleDto) {
    return this.prisma.article.update({ where: { article_id: id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.article.delete({ where: { article_id: id } });
  }

 
  
}
