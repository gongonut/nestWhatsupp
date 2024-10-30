import { Module } from '@nestjs/common';
import { IaResourceService } from './ia-resource.service';
import { IaResourceController } from './ia-resource.controller';

@Module({
  controllers: [IaResourceController],
  providers: [IaResourceService],
})
export class IaResourceModule {}
