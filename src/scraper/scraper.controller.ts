import { Controller, Post, Body } from '@nestjs/common';

import { ScraperService } from './scraper.service';
import { CreateScraperDto } from './dto/create-scraper.dto';

@Controller('scrapers')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Post()
  create(@Body() createScraperDto: CreateScraperDto) {
    return this.scraperService.create(createScraperDto);
  }

  // @Get()
  // findAll() {
  //   return this.scraperService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.scraperService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateScraperDto: UpdateScraperDto) {
  //   return this.scraperService.update(+id, updateScraperDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.scraperService.remove(+id);
  // }
}
