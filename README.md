### В цій версії коду працювати можна як:
#### v1 → дані вказані всередині коду, без можливості вибору
1. npm run start:dev
2. curl http://localhost:3000/books/scrape

#### v2 → дані отримує з командного рядка
```bash
npx nestjs-command book:parse -s value1 -b value2
```
```bash
npx nestjs-command book:parse --site value1 --book value2
```
```bash
nestjs-command book:parse -s rub -b alisa  
```




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
## При роботі з командного рядка:
```bash
npx nestjs-command book:parse -s value1 -b value2
```
```bash
npx nestjs-command book:parse --site value1 --book value2
```
p.s. Дані взяв тут → https://www.npmjs.com/package/nestjs-command/v/3.0.0
