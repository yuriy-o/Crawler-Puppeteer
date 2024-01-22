import { PartialType } from '@nestjs/mapped-types';

import { CreateScraperDto } from './create-scraper.dto';
import { IsNotEmpty, Min } from 'class-validator';

export class UpdateScraperDto extends PartialType(CreateScraperDto) {
  @IsNotEmpty()
  @Min(0)
  id: number;

  bookText: string;
}
