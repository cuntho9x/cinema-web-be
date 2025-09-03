import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'; // 👈 THÊM DÒNG NÀY

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser()); 

  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3002'], 
    credentials: true, 
  });

  await app.listen(3000);
}
bootstrap();
