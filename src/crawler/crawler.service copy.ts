import { Injectable } from '@nestjs/common';
import ResourceUrlEnum from '../helper/resourceUrls';
import * as fs from 'fs';
import * as path from 'path';
import puppeteer, { Browser, ElementHandle, Page } from 'puppeteer';
import 'dotenv/config';
import * as process from 'process';

const BASE: string = process.env.BASE;
const book: string = ResourceUrlEnum.ALISA;
// const bookUrl: string = ResourceUrlEnum.ALISA;
const rub: string = ResourceUrlEnum.SITE_RUB;
const fileName: string = book.replace(BASE, '').replace('.html', '.txt');
let filePath: string = '';

@Injectable()
export class CrawlerService {
  async parser(site: string, book: string): Promise<string> {
    const folderPath: string = path.join(
      process.cwd(),
      'src',
      'downloaded-books',
    );
    console.log('folderPath >>>>', folderPath);

    // const fileName: string = bookUrl.replace(BASE, '').replace('.html', '.txt');
    const fileName: string = `${site}-${book}.txt`;
    console.log('fileName >>>>', fileName);

    // filePath = `${__dirname}/${fileName}`;
    filePath = path.join(folderPath, fileName);
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
    const bookUrl: string = ResourceUrlEnum.ALISA;
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

    await fs.promises.writeFile(filePath, bookText);
  }
}
