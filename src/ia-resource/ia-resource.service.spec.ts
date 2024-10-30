import { Test, TestingModule } from '@nestjs/testing';
import { IaResourceService } from './ia-resource.service';

describe('IaResourceService', () => {
  let service: IaResourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IaResourceService],
    }).compile();

    service = module.get<IaResourceService>(IaResourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
