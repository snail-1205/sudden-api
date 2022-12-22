import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import puppeteer from 'puppeteer-extra';
const hide = require('puppeteer-extra-plugin-stealth');

puppeteer.use(hide());

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
