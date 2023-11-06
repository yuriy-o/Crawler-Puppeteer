import { Controller, Get } from '@nestjs/common';
import { PuppeteerService } from './puppeteer/puppeteer.service';

@Controller('books')
export class BooksController {
  constructor(private readonly puppeteerService: PuppeteerService) {}

  @Get('scrape')
  async scrapeBook(): Promise<void> {
    return this.puppeteerService.scrapeBook();
  }
}
