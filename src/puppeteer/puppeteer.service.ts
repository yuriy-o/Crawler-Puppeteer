import { Injectable } from '@nestjs/common';
import ResourceUrlEnum from '../helper/resourceUrls';
import * as fs from 'fs';
import * as path from 'path';
import puppeteer from 'puppeteer';
import 'dotenv/config';

@Injectable()
export class PuppeteerService {
  async scrapeBook(): Promise<void> {
    const BASE = process.env.BASE;
    const bookUrl = ResourceUrlEnum.BOOK_3;

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(bookUrl);

    let bookText = '';
    let numberOfPages = 0;

    const pagination = await page.$('.pagi-nav');

    if (pagination) {
      const links = await pagination.$$eval('a', (elements) =>
        elements.map((el) => el.textContent),
      );

      const numbers = links
        .map(Number)
        .filter((value: number) => !isNaN(value));
      numberOfPages = Math.max(...numbers);
      console.log('numberOfPages >>>>', numberOfPages);
    } else {
      console.error('Не знайдено блок пагінації');
    }

    for (let i = 1; i <= numberOfPages; i++) {
      const url = bookUrl.replace(BASE, `${BASE}page-${i}-`);
      console.log('url >>>>', url);

      await page.goto(url);

      const text = await page.$eval(
        '#texts',
        (e: HTMLElement) => e.textContent,
      );
      const textFromPage = await text.replace(/\uFFFC/g, '');
      bookText += textFromPage.trim() + ' ';
    }

    await browser.close();

    const folderPath = path.join(process.cwd(), 'src', 'books');
    if (
      !(await fs.promises
        .access(folderPath)
        .then(() => true)
        .catch(() => false))
    ) {
      await fs.promises.mkdir(folderPath);
    }

    const fileName: string = bookUrl.replace(BASE, '').replace('.html', '.txt');
    const filePath = path.join(folderPath, fileName);
    await fs.promises.writeFile(filePath, bookText);
  }
}
