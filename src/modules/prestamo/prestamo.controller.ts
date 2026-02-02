import { Body, Controller, Post, Param, ParseIntPipe, Get } from '@nestjs/common';
import { PrestamoService } from './prestamo.service';
import { Prisma } from 'src/generated/prisma/client';
import { Public } from 'src/shared/config/guards/token/token.guard';

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

  @Public()
  @Get('estado/:estado')
  async listarPrestamosPorEstado(
    @Param('estado') estado: string,
  ) {
    return this.prestamoService.listarPrestamosPorEstado(estado);
  }
}
