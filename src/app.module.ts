import { Module } from '@nestjs/common';
import { BooksController } from './app.controller';
import { AppService } from './app.service';
import { PuppeteerService } from './puppeteer/puppeteer.service';

@Module({
  imports: [],
  controllers: [BooksController],
  providers: [AppService, PuppeteerService],
})
export class AppModule {}
