import { Module } from '@nestjs/common';
import { CrawlerController } from './crawler/crawler.controller';
import { CrawlerModule } from './crawler/crawler.module';
import { CrawlerService } from './crawler/crawler.service';

import { CommandModule } from './command/command.module';
import { BasicCommand } from './command/command.service';

@Module({
  imports: [CrawlerModule, CommandModule],
  controllers: [CrawlerController],
  providers: [CrawlerService, BasicCommand],
})
export class AppModule {}
