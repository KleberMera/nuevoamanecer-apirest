import { Test, TestingModule } from '@nestjs/testing';
import { NominaController } from './nomina.controller';
import { NominaService } from './nomina.service';

describe('NominaController', () => {
  let controller: NominaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NominaController],
      providers: [NominaService],
    }).compile();

    controller = module.get<NominaController>(NominaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
