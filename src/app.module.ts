import { Module } from '@nestjs/common';
import { CrawlerController } from './crawler/crawler.controller';
import { CrawlerModule } from './crawler/crawler.module';
import { CrawlerService } from './crawler/crawler.service';
// import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';

@Module({
  imports: [CommandModule, CrawlerModule],
  controllers: [CrawlerController],
  providers: [CrawlerService],
})
export class AppModule {}
