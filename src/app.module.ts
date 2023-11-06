import { Module } from '@nestjs/common';
import { BooksController } from './app.controller';
import { PuppeteerModule } from './puppeteer/puppeteer.module';
import { PuppeteerService } from './puppeteer/puppeteer.service';

@Module({
  imports: [PuppeteerModule],
  controllers: [BooksController],
  providers: [PuppeteerService],
})
export class AppModule {}
