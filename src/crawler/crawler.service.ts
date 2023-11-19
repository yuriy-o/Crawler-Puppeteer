import { Command, Positional } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import ResourceUrlEnum from '../helper/resourceUrls';
import * as fs from 'fs';
import * as path from 'path';
import puppeteer, { Browser, ElementHandle, Page } from 'puppeteer';
import 'dotenv/config';
import * as process from 'process';

@Injectable()
export class CrawlerService {
  @Command({
    command: 'book:parse',
    describe: 'Parse a book',
  })
  async handle(
    @Positional({
      name: 'site',
      describe: 'Site value',
      alias: 's',

      type: 'string',
    })
    site: string,
    @Positional({
      name: 'book',
      describe: 'Book value',
      alias: 'b',
      type: 'string',
    })
    book: string,
  ) {
    const allowedSites: string[] = ['rub', 'readukrainianbooks'];
    const allowedBooks: string[] = [
      'alisa',
      'gra-prestoliv',
      'ja-bachu-vas-cikavit-pitma',
    ];
    if (!allowedSites.includes(site.toLowerCase())) {
      console.log('Вибачте, але такий сайт не знайдено');
      return;
    }
    if (!allowedBooks.includes(book.toLowerCase())) {
      console.log('Вибачте, але такої книги не знайдено');
      return;
    }

    console.log(`Site >>>> ${site}`);
    console.log(`Book >>>> ${book}`);

    await this.generateFilePath(site, book);
    // await this.scrapeBook(site, book, filePath);
  }

  async generateFilePath(site: string, book: string): Promise<string> {
    const folderPath: string = path.join(
      process.cwd(),
      'src',
      'downloaded-books',
    );

    // const fileName: string = bookUrl.replace(BASE, '').replace('.html', '.txt');
    const fileName: string = `${site}-${book}.txt`;

    const filePath: string = path.join(folderPath, fileName);
    console.log('filePath >>>>', filePath);

    try {
      await fs.promises.access(folderPath);
    } catch (error) {
      await fs.promises.mkdir(folderPath);
    }

    await this.scrapeBook(site, book, filePath);

    return filePath;
  }

  async scrapeBook(
    site: string,
    book: string,
    filePath: string,
  ): Promise<void> {
    const BASE: string = process.env.BASE;
    const bookUrl: string = ResourceUrlEnum.BOOK_33;
    const browser: Browser = await puppeteer.launch({ headless: 'new' });
    const page: Page = await browser.newPage();
    await page.goto(bookUrl);

    let bookText: string = '';
    let numberOfPages: number = 0;

    const pagination: ElementHandle<Element> = await page.$('.pagi-nav');

    if (pagination) {
      const links: string[] = await pagination.$$eval('a', (elements) =>
        elements.map((el) => el.textContent),
      );

      const numbers: number[] = links
        .map(Number)
        .filter((value: number) => !isNaN(value));
      numberOfPages = Math.max(...numbers);
      console.log('numberOfPages >>>>', numberOfPages);
    } else {
      console.error('Не знайдено блок пагінації');
    }

    for (let i: number = 1; i <= numberOfPages; i++) {
      const url: string = bookUrl.replace(BASE, `${BASE}page-${i}-`);
      console.log('url >>>>', url);

      await page.goto(url);

      const text: string = await page.$eval(
        '#texts',
        (e: HTMLElement) => e.textContent,
      );
      const textCleaning: string = text
        .replace(/\uFFFC/g, '')
        .replace(/&nbsp;/g, '')
        .replace(/\u00A0/g, '');
      bookText += textCleaning.trim() + ' ';
    }

    await browser.close();

    const folderPath: string = path.join(
      process.cwd(),
      'src',
      'downloaded-books',
    );
    if (
      !(await fs.promises
        .access(folderPath)
        .then((): Promise<boolean> => Promise.resolve(true))
        .catch((): Promise<boolean> => Promise.resolve(false)))
    ) {
      await fs.promises.mkdir(folderPath);
    }

    // const fileName: string = bookUrl.replace(BASE, '').replace('.html', '.txt');
    // const filePath: string = path.join(folderPath, fileName);
    // await fs.promises.writeFile(filePath, bookText);
  }
}
