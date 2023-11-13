import { Module } from '@nestjs/common';
import { BooksController } from './app.controller';
import { CrawlerModule } from './crawler/crawler.module';
import { CrawlerService } from './crawler/./crawler.service';

@Module({
  imports: [CrawlerModule],
  controllers: [BooksController],
  providers: [CrawlerService],
})
export class AppModule {}
