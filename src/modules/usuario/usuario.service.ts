import { Injectable } from '@nestjs/common';
import { Usuario } from 'src/generated/prisma/browser';
import { UsuarioCreateInput } from 'src/generated/prisma/models';
import { PrismaService } from 'src/prisma/prisma.service';
import { apiResponse } from 'src/shared/models/apiResponse';

@Injectable()
export class UsuarioService {

  constructor(private prisma: PrismaService) {}

  //crear usuario
  async createUsuario(data: UsuarioCreateInput): Promise<apiResponse<Usuario>> {
    const nuevoUsuario = await this.prisma.usuario.create({
      data,
    });
    return {
      message: 'Usuario creado exitosamente',
      data: nuevoUsuario,
      status: 201,
    };
  }
}
