import { Controller, Post, Body, Get, Delete, Patch, Param } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import type { UsuarioCreateInput, UsuarioUncheckedUpdateInput } from 'src/generated/prisma/models';
import { Public } from 'src/shared/config/guards/token/token.guard';
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}
  @Public()
  @Post()
  async create(@Body() data: UsuarioCreateInput) {
    return await this.usuarioService.createUsuario(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usuarioService.listarUsuario(Number(id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UsuarioUncheckedUpdateInput) {
    return await this.usuarioService.actualizarUsuario({ ...data, id: Number(id) });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usuarioService.eliminarUsuario(Number(id));
  }

  @Get('estado/:estado')
  async findByEstado(@Param('estado') estado: string) {
    return await this.usuarioService.listarUsuariosPorEstado(estado);
  }
}
