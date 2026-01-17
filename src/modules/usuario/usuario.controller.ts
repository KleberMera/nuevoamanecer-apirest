import { Controller, Post, Body } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import type { UsuarioCreateInput } from 'src/generated/prisma/models';
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async create(@Body() data: UsuarioCreateInput) {
    return await this.usuarioService.createUsuario(data);
  }
}
