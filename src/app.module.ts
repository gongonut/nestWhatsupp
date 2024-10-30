import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
// import { GeneralService } from './bot-wp/general.service';
import { BotWpModule } from './bot-wp/bot-wp.module';
import { BotWpService } from './bot-wp/bot-wp.service';
import { GeneralService } from './bot-wp/general.service';
import { IoFilesModule } from './io-files/io-files.module';
import { IaResourceModule } from './ia-resource/ia-resource.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BotWpModule,
    IoFilesModule,
    IaResourceModule,
  ],
  controllers: [AppController],
  providers: [AppService, BotWpService, GeneralService],
})
export class AppModule {}
