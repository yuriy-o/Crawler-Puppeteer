## Puppeteer

Puppeteer модуль дозволяє отримати текст сторінки з вказаного URL за первим селектором.
Додатково Puppeteer виконує пошук пагінації, і, якщо вона є, то отримує текст з усіх сторінок.
Далі поєднує текст кожної сторінки, чистить та зберігає в окремий файл.

[//]: # (![Demo]&#40;./preview.gif&#41;)

## Installation

```bash
$ npm install
```

## Development

```bash
npm run start
```

### watch mode

```bash
npm run start:dev
```

### production mode

```bash
npm run start:prod
```

## Running the app

### Prerequisites

To initiate the parsing process, navigate to http://localhost:3000/books/scrape in your browser,
or use the following command in the terminal:

```bash
curl http://localhost:3000/books/scrape
```

## Test

### unit tests

```bash
$ npm run test copy
```

### e2e tests

```bash
$ npm run test copy:e2e
```

### test coverage

```bash
$ npm run test copy:cov
```
