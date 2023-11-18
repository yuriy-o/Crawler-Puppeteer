import { Module } from '@nestjs/common';
import { CrawlerController } from './crawler/crawler.controller';
import { CrawlerModule } from './crawler/crawler.module';
import { CrawlerService } from './crawler/crawler.service';

@Module({
  imports: [CrawlerModule],
  controllers: [CrawlerController],
  providers: [CrawlerService],
})
export class AppModule {}
