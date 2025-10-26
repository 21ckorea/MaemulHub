import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
export async function createNestApp() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  return app;
}
export async function createExpressApp() {
  const app = await createNestApp();
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return expressApp;
}
