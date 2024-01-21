import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScraperService } from './scraper.service';
import { ScraperController } from './scraper.controller';
import { ScraperEntity } from './entities/scraper.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ScraperEntity])],
  controllers: [ScraperController],
  providers: [ScraperService],
})
export class ScraperModule {}
