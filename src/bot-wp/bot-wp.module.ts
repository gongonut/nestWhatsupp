import { Module } from '@nestjs/common';
import { BotWpService } from './bot-wp.service';
import { BotWpController } from './bot-wp.controller';
import { GeneralService } from './general.service';

@Module({
  controllers: [BotWpController],
  providers: [BotWpService, GeneralService],
})
export class BotWpModule {}
