import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import * as process from 'process';

const PORT: string | 3033 = process.env.PORT || 3033;
const HOST: string = process.env.HOST;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  await app.listen(PORT);
}
bootstrap().then((): void => {
  console.log(
    `Nest application successfully started: https://${HOST}:${PORT}/api/v1/`,
  );
});
