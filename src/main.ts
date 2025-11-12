import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser()); 

  // Files are saved to fe/public, so no need to serve from be/public
  // All uploaded files (like user avatars) are stored in fe/public/user
  // and served directly by Next.js frontend

  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3002'], 
    credentials: true, 
  });

  await app.listen(3000);
}
bootstrap();
