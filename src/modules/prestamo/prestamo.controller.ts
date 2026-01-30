import { Body, Controller, Post } from '@nestjs/common';
import { PrestamoService } from './prestamo.service';
import { Prisma } from 'src/generated/prisma/client';

@Controller('prestamo')
export class PrestamoController {
  constructor(private readonly prestamoService: PrestamoService) {}

  @Post('') 
  async createPrestam(@Body() data: Prisma.PrestamoCreateInput) {
    return this.prestamoService.createPrestamo(data);
  }
}
