import { Controller, Get } from '@nestjs/common';
import { CrawlerService } from './crawler/./crawler.service';

@Controller('books')
export class BooksController {
  constructor(private readonly puppeteerService: CrawlerService) {}

  @Get('scrape')
  async scrapeBook(): Promise<void> {
    return this.puppeteerService.scrapeBook();
  }
}
