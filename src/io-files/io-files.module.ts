import { Module } from '@nestjs/common';
import { IoFilesService } from './io-files.service';
import { IoFilesController } from './io-files.controller';

@Module({
  controllers: [IoFilesController],
  providers: [IoFilesService],
})
export class IoFilesModule {}
