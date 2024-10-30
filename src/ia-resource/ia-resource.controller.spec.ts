import { Test, TestingModule } from '@nestjs/testing';
import { IaResourceController } from './ia-resource.controller';
import { IaResourceService } from './ia-resource.service';

describe('IaResourceController', () => {
  let controller: IaResourceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IaResourceController],
      providers: [IaResourceService],
    }).compile();

    controller = module.get<IaResourceController>(IaResourceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
