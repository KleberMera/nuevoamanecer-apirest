import { Controller, Post, Body, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { DettPrestamoService } from './dett-prestamo.service';
import { Prisma } from 'src/generated/prisma/client';

@Controller('dett-prestamo')
export class DettPrestamoController {
  constructor(private readonly dettPrestamoService: DettPrestamoService) {}

  @Post(':prestamoId')
  async createDettPrestamo(
    @Param('prestamoId', ParseIntPipe) prestamoId: number,
    @Body() data: Omit<Prisma.DetallePrestamoCreateInput, 'prestamo'>,
  ) {
    return this.dettPrestamoService.createDettPrestamo(prestamoId, data);
  }

  @Patch(':dettPrestamoId/status')
  async updateDettPrestamoStatus(
    @Param('dettPrestamoId', ParseIntPipe) dettPrestamoId: number,
    @Body('estadoPago') estadoPago: string,
  ) {
    return this.dettPrestamoService.updateDettPrestamoStatus(dettPrestamoId, estadoPago);
  }
}
