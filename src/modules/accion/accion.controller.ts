import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AccionService } from './accion.service';
import { Prisma } from 'src/generated/prisma/client';

@Controller('accion')
export class AccionController {
  constructor(private readonly accionService: AccionService) {}

  @Post()
  async crearRol(@Body() data: Prisma.AccionCreateInput) {
    return this.accionService.createAccion(data);
  }

  @Get('usuario/:usuarioId')
  async listarAccionesPorUsuario(@Param('usuarioId') usuarioId: number) {
    return this.accionService.listarAccionesPorUsuario(Number(usuarioId));
  }
}
