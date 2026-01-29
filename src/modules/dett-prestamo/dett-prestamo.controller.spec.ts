import { Test, TestingModule } from '@nestjs/testing';
import { DettPrestamoController } from './dett-prestamo.controller';
import { DettPrestamoService } from './dett-prestamo.service';

describe('DettPrestamoController', () => {
  let controller: DettPrestamoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DettPrestamoController],
      providers: [DettPrestamoService],
    }).compile();

    controller = module.get<DettPrestamoController>(DettPrestamoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
