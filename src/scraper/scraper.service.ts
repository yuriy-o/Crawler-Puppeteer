import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import puppeteer from 'puppeteer';

import { CreateScraperDto } from './dto/create-scraper.dto';
import { ScraperEntity } from './entities/scraper.entity';

@Injectable()
export class ScraperService {
  constructor(
    @InjectRepository(ScraperEntity)
    private readonly scraperRepository: Repository<ScraperEntity>,
  ) {}

  async create(createScraperDto: CreateScraperDto) {
    const { url } = createScraperDto;

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(url);

    let bookText: string = '';
    let characterCount: number = 0;
    let paginationCount: number = 0;
    let newBook: ScraperEntity;

    const pagination = await page.$('.pagi-nav');

    if (pagination) {
      const links = await pagination.$$eval('a', (elements) =>
        elements.map((el) => el.textContent),
      );

      const pagesInPagination = links
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
      const domain = matches[1];
      for (let i = 1; i <= paginationCount; i++) {
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

    await browser.close();

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

  // update(id: number, updateScraperDto: UpdateScraperDto) {
  //   return `This action updates a #${id} scraper`;
  // }

  async remove(id: number) {
    const book = await this.scraperRepository.findOne({ where: { id } });

    if (!book) throw new NotFoundException(`Book with id: ${id} not found`);

    const deletionResult = await this.scraperRepository.delete({ id });

    return {
      message: `Book with id: ${id} has been successfully deleted`,
      deletionResult,
    };
  }
}
