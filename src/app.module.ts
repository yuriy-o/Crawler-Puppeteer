import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommandModule } from 'nestjs-command';

import { CrawlerController } from './crawler/crawler.controller';
import { CrawlerModule } from './crawler/crawler.module';
import { CrawlerService } from './crawler/crawler.service';
import { ScraperModule } from './scraper/scraper.module';
import { ScraperEntity } from './scraper/entities/scraper.entity';

@Module({
  imports: [
    CommandModule,
    CrawlerModule,
    ScraperModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.js, .ts}', ScraperEntity],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([ScraperEntity]),
  ],
  controllers: [CrawlerController],
  providers: [CrawlerService],
})
export class AppModule {}
