import { Test, TestingModule } from '@nestjs/testing';
import { NominaService } from './nomina.service';

describe('NominaService', () => {
  let service: NominaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NominaService],
    }).compile();

    service = module.get<NominaService>(NominaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
