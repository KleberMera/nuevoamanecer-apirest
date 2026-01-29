import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AccionService } from './accion.service';
import { Prisma } from 'src/generated/prisma/client';
import { Public } from 'src/shared/config/guards/token/token.guard';

@Controller('accion')
export class AccionController {
  constructor(private readonly accionService: AccionService) {}

  @Post()
  async crearRol(@Body() data: Prisma.AccionCreateInput) {
    return this.accionService.createAccion(data);
  }

  @Get('usuario/:usuarioId')
  async listarAccionesPorUsuario(@Param('usuarioId') usuarioId: number, @Query('periodo') periodo?: string) {
    return this.accionService.listarAccionesPorUsuario(Number(usuarioId), periodo);
  }

  @Get('periodo')
  async listarAccionesPorPeriodo(@Query('periodo') periodo?: string) {
    return this.accionService.listarAccionesPorPeriodo(periodo);
  }
  
  @Public()
  @Get('total/:usuarioId')
  async totalAccionesPorUsuario(@Param('usuarioId') usuarioId: number, @Query('periodo') periodo?: string) {
    return this.accionService.totalAccionesPorUsuario(Number(usuarioId), periodo);
  }

  //Actualizar Accion
  @Patch(':id')
  async actualizarAccion(@Param('id') id: number, @Body() data: Partial<Prisma.AccionUncheckedUpdateInput>) {
    return this.accionService.actualizarAccion(Number(id), data);
  }


}
