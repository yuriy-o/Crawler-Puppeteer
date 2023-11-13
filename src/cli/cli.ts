import { NestFactory } from '@nestjs/core';
import { CliModule } from './cli.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(CliModule);
  app.close();
}
bootstrap();
