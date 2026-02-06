import { Controller, Get, Query } from '@nestjs/common';
import { NominaService } from './nomina.service';

@Controller('nomina')
export class NominaController {
  constructor(private readonly nominaService: NominaService) {}

  @Get()
  async obtenerNomina(@Query('periodo') periodo?: string) {
    return this.nominaService.obtenerNominaPorPeriodo(periodo);
  }
}
