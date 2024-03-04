import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv'
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  dotenv.config()

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1/')
  app.use(cookieParser());
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
