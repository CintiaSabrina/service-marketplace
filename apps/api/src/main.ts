import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  app.enableCors({ origin: 'http://localhost:3000' });
  await app.listen(process.env.PORT ?? 8000);
}
void bootstrap();
