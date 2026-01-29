import { Test, TestingModule } from '@nestjs/testing';
import { DettPrestamoService } from './dett-prestamo.service';

describe('DettPrestamoService', () => {
  let service: DettPrestamoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DettPrestamoService],
    }).compile();

    service = module.get<DettPrestamoService>(DettPrestamoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
