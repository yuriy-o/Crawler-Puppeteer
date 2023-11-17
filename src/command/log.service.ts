import { Injectable } from '@nestjs/common';

@Injectable()
export class LogService {
  log(data: any): void {
    console.log(data); // You can customize the logging logic
  }
}
