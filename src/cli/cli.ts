import { NestFactory } from '@nestjs/core';
import { CliModule } from './cli.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(CliModule);
  await app.close();
}
bootstrap();
