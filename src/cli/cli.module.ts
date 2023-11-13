// import { Module } from '@nestjs/common';
// import { CrawlerController } from '../crawler/crawler.controller';
//
// @Module({
//   controllers: [CrawlerController],
// })
// export class CliModule {}

import { Module } from '@nestjs/common';
import { CrawlerController } from '../crawler/crawler.controller';
import { CrawlerService } from '../crawler/crawler.service';

@Module({
  controllers: [CrawlerController],
  providers: [CrawlerService],
})
export class CliModule {}
