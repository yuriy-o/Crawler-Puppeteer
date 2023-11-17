import { Module } from '@nestjs/common';
import { BasicCommand } from './command.service';
import { LogService } from './log.service';

@Module({
  providers: [BasicCommand, LogService],
  exports: [BasicCommand], // чи треба експортувати ???
})
export class CommandModule {}
