import { Controller, Get, Param } from '@nestjs/common';
import { CrawlerService } from './crawler.service';

@Controller('books')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Get('scrape/:site/:book')
  async scrapeBook(
    @Param('site') site: string,
    @Param('book') book: string,
    @Param('filePath') filePath: string,
  ): Promise<any> {
    // return this.crawlerService.parser(site, book);
    return this.crawlerService.scrapeBook(site, book, filePath);
  }
}
