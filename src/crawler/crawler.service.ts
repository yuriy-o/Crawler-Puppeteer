import { Injectable } from '@nestjs/common';
import ResourceUrlEnum from '../helper/resourceUrls';
import * as fs from 'fs';
import * as path from 'path';
import puppeteer, { Browser, ElementHandle, Page } from 'puppeteer';
import 'dotenv/config';
import * as process from 'process';

@Injectable()
export class CrawlerService {
  async scrapeBook(): Promise<void> {
    const BASE: string = process.env.BASE;
    const bookUrl: string = ResourceUrlEnum.BOOK_3;
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
      const textFromPage: string = await text.replace(/\uFFFC/g, '');
      bookText += textFromPage.trim() + ' ';
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

    const fileName: string = bookUrl.replace(BASE, '').replace('.html', '.txt');
    const filePath: string = path.join(folderPath, fileName);
    await fs.promises.writeFile(filePath, bookText);
  }
}
