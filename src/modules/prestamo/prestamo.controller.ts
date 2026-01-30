import { Body, Controller, Post, Param, ParseIntPipe } from '@nestjs/common';
import { PrestamoService } from './prestamo.service';
import { Prisma } from 'src/generated/prisma/client';

@Controller('prestamo')
export class PrestamoController {
  constructor(private readonly prestamoService: PrestamoService) {}

  @Post(':usuarioId') 
  async createPrestamo(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Body() data: Omit<Prisma.PrestamoCreateInput, 'usuario'>,
  ) {
    return this.prestamoService.createPrestamo(usuarioId, data);
  }
}
