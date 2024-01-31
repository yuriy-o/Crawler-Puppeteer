import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as puppeteer from 'puppeteer';

import { CreateScraperDto } from './dto/create-scraper.dto';
import { ScraperEntity } from './entities/scraper.entity';
import { UpdateScraperDto } from './dto/update-scraper.dto';

@Injectable()
export class ScraperService {
  private browser: puppeteer.Browser;

  constructor(
    @InjectRepository(ScraperEntity)
    private readonly scraperRepository: Repository<ScraperEntity>,
  ) {}

  static async create(
    scraperRepository: Repository<ScraperEntity>,
  ): Promise<ScraperService> {
    const instance: ScraperService = new ScraperService(scraperRepository);
    await instance.initializeBrowser();
    return instance;
  }

  private async initializeBrowser(): Promise<void> {
    this.browser = await puppeteer.launch({ headless: 'new' });
  }

  private async destroyBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async create(createScraperDto: CreateScraperDto): Promise<ScraperEntity> {
    await this.initializeBrowser();

    const { url }: { url: string } = createScraperDto;

    const page: puppeteer.Page = await this.browser.newPage();
    await page.goto(url);

    let bookText: string = '';
    let characterCount: number = 0;
    let paginationCount: number = 0;
    let newBook: ScraperEntity;

    const pagination = await page.$('.pagi-nav');

    if (pagination) {
      const links: string[] = await pagination.$$eval('a', (elements) =>
        elements.map((el) => el.textContent),
      );

      const pagesInPagination: number[] = links
        .map(Number)
        .filter((value: number) => !isNaN(value));
      paginationCount = Math.max(...pagesInPagination);
    } else {
      paginationCount = 1;

      console.error('Не знайдено блок пагінації');
    }

    const domainRegex = /^(?:https?:\/\/)?(?:www\.)?([^\/]+)/;
    const matches = url.match(domainRegex);

    if (matches) {
      const domain: string = matches[1];
      for (let i: number = 1; i <= paginationCount; i++) {
        const paginationUrl = `https://${domain}/page-${i}-${url.substring(
          url.lastIndexOf('/') + 1,
        )}`;
        console.log('paginationUrl >>>>', paginationUrl);

        await page.goto(paginationUrl);

        const text: string = await page.$eval(
          '#texts',
          (e: HTMLElement) => e.textContent,
        );
        const textCleaning: string = text
          .replace(/\uFFFC/g, '')
          .replace(/&nbsp;/g, '')
          .replace(/\u00A0/g, '');
        bookText += textCleaning.trim() + ' ';

        characterCount = bookText.length;
      }

      newBook = this.scraperRepository.create({
        url,
        bookText,
        characterCount,
        paginationCount,
      });

      await this.scraperRepository.save(newBook);
    } else {
      console.log('Invalid URL format');
    }

    await page.close();

    return newBook;
  }

  async findAll() {
    const books: ScraperEntity[] = await this.scraperRepository.find({
      order: { createdAt: 'DESC' },
    });
    const total: number = books.length;

    return { books, total };
  }

  async findOne(id: number) {
    const book: ScraperEntity | undefined =
      await this.scraperRepository.findOne({
        where: { id },
      });

    if (!book) throw new NotFoundException(`Book with id: ${id} not found`);

    return book;
  }

  async update(updateScraperDto: UpdateScraperDto) {
    const {
      id,
      bookText,
      ...updateData
    }: { id: number; bookText: string; [key: string]: any } = updateScraperDto;
    const characterCount: number = bookText.length;

    const book: ScraperEntity = await this.scraperRepository.findOne({
      where: { id },
    });

    if (!book) throw new NotFoundException(`Book with id: ${id} not found`);

    book.bookText = bookText;
    book.characterCount = characterCount;

    await this.scraperRepository.save(book);

    return this.scraperRepository.update(id, updateData);
  }

  async remove(id: number) {
    const book: ScraperEntity = await this.scraperRepository.findOne({
      where: { id },
    });

    if (!book) throw new NotFoundException(`Book with id: ${id} not found`);

    const deletionResult = await this.scraperRepository.delete({ id });

    return {
      message: `Book with id: ${id} has been successfully deleted`,
      deletionResult,
    };
  }

  async onModuleDestroy() {
    // Викликаємо метод знищення браузера при завершенні роботи з сервісом
    await this.destroyBrowser();
  }
}
