import { BadRequestException, Injectable } from '@nestjs/common';
import { Usuario } from 'src/generated/prisma/browser';
import { UsuarioCreateInput } from 'src/generated/prisma/models';
import { PrismaService } from 'src/prisma/prisma.service';
import { BcryptService } from 'src/shared/config/bcrypt/bcrypt.service';
import { apiResponse } from 'src/shared/models/apiResponse';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService,
    private bcryptService: BcryptService
  ) {}

  private async validarEmail(email: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
      select: { email: true },
    });
    if (!usuario) return;
    throw new Error('El email ya está en uso');
  }

  //crear usuario
  async createUsuario(data: UsuarioCreateInput): Promise<apiResponse<Usuario>> {
    try {
      await this.validarEmail(data.email);
      const nuevoUsuario = await this.prisma.usuario.create({
        data: {
          ...data,
          password: await this.bcryptService.hashPassword(data.password),
        },
      });
      return {
        message: 'Usuario creado exitosamente',
        data: nuevoUsuario,
        status: 201,
      };
    } catch (error) {
      throw new BadRequestException(`Error al crear el usuario: ${error}`);
    }
  }
}
