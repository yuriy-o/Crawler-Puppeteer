// import { NestFactory } from '@nestjs/core';
import { CommandFactory } from 'nest-commander';
// import { LogService } from './command/log.service';
// import { LogService } './command/log.service';  // TODO Перевірити імпорт → https://docs.nestjs.com/recipes/nest-commander#more-information:~:text=import%20%7B%20LogService%20%7D%20%27./log.service%27%3B
import { AppModule } from './app.module';
import 'dotenv/config';
import * as process from 'process';

const PORT: string | 3030 = process.env.PORT || 3030;
const HOST: string = process.env.HOST;

async function bootstrap(): Promise<void> {
  // const app = await NestFactory.create(AppModule);
  // await app.listen(PORT);

  // await CommandFactory.run(AppModule, new LogService());
  // or, if you only want to print Nest's warnings and errors
  // await CommandFactory.run(AppModule, ['warn', 'error']);

  await CommandFactory.run(AppModule);
}
bootstrap().then((): void => {
  console.log(
    `Nest application successfully started: https://${HOST}:${PORT}/api/`,
  );
});
