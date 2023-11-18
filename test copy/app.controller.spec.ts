import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from '../src/app.controller';
import { CrawlerService } from '../src/crawler/./crawler.service';

describe('BooksController', () => {
  let booksController: BooksController;
  let puppeteerService: CrawlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: CrawlerService,
          useValue: {
            scrapeBook: jest.fn(),
          },
        },
      ],
    }).compile();

    booksController = module.get<BooksController>(BooksController);
    puppeteerService = module.get<CrawlerService>(CrawlerService);
  });

  describe('scrapeBook', () => {
    it('should scrape the book', async () => {
      await booksController.scrapeBook();
      expect(puppeteerService.scrapeBook).toBeCalled();
    });
  });
});
