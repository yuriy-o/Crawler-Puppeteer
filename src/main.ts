import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import * as process from 'process';

const PORT: string | 3030 = process.env.PORT || 3030;
const HOST: string = process.env.HOST;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
}
bootstrap().then((): void => {
  console.log(
    `Nest application successfully started: https://${HOST}:${PORT}/api/`,
  );
});
