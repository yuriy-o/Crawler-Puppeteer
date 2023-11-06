import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './app.controller';
import { PuppeteerService } from './puppeteer/puppeteer.service';

describe('BooksController', () => {
  let booksController: BooksController;
  let puppeteerService: PuppeteerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: PuppeteerService,
          useValue: {
            scrapeBook: jest.fn(),
          },
        },
      ],
    }).compile();

    booksController = module.get<BooksController>(BooksController);
    puppeteerService = module.get<PuppeteerService>(PuppeteerService);
  });

  describe('scrapeBook', () => {
    it('should scrape the book', async () => {
      await booksController.scrapeBook();
      expect(puppeteerService.scrapeBook).toBeCalled();
    });
  });
});
