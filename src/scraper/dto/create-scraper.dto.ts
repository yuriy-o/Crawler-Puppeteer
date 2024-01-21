import { IsNotEmpty } from 'class-validator';

export class CreateScraperDto {
  @IsNotEmpty()
  url: string;
}
