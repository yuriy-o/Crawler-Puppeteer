import { Injectable } from '@nestjs/common';
import ResourceUrls from '../helper/resourceUrls';
import * as fs from 'fs';
import * as path from 'path';
import puppeteer from 'puppeteer';

@Injectable()
export class PuppeteerService {
  async scrapeBook(): Promise<void> {
    const URL = ResourceUrls.Book_3;
    const base = 'https://readukrainianbooks.com/';

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(URL);

    let bookText = '';
    let numberOfPages = 0;

    // Отримаємо елемент блоку пагінації
    const pagination = await page.$('.pagi-nav');

    if (pagination) {
      // Отримаємо текст усіх <a> елементів у блоку пагінації
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
      const url = URL.replace(base, `${base}page-${i}-`);
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

    const folderPath = path.join(process.cwd(), 'src', 'Books');
    // const folderPath = path.join(__dirname, 'Books');
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    const fileName: string = URL.replace(base, '').replace('.html', '.txt');
    const filePath = path.join(folderPath, fileName);
    fs.writeFileSync(filePath, bookText);
  }
}
