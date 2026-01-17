import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Usuario } from 'src/generated/prisma/browser';
import {
  UsuarioCreateInput,
  UsuarioUncheckedUpdateInput,
} from 'src/generated/prisma/models';
import { PrismaService } from 'src/prisma/prisma.service';
import { BcryptService } from 'src/shared/config/bcrypt/bcrypt.service';
import { apiResponse } from 'src/shared/models/apiResponse';

@Injectable()
export class UsuarioService {
  constructor(
    private prisma: PrismaService,
    private bcryptService: BcryptService,
  ) {}

  private async validarEmail(email: string, idUsuario?: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
      select: { email: true, id: true },
    });
    if (!usuario) return;
    if (idUsuario && usuario.id === idUsuario) return;
    throw new Error('El email ya está en uso');
  }

  private async validarNombreUsuario(nombreUsuario: string, idUsuario?: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { nombreUsuario },
      select: { nombreUsuario: true, id: true },
    });
    if (!usuario) return;
    if (idUsuario && usuario.id === idUsuario) return;
    throw new Error('El nombre de usuario ya está en uso');
  }

  //crear usuario
  async createUsuario(data: UsuarioCreateInput): Promise<apiResponse<Usuario>> {
    try {
      if (data.email) {
        await this.validarEmail(data.email);
      }
      await this.validarNombreUsuario(data.nombreUsuario);
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

  async listarUsuario(id: number): Promise<apiResponse<Usuario>> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    return {
      message: 'Usuario obtenido exitosamente',
      data: usuario,
      status: 200,
    };
  }

  async eliminarUsuario(id: number) {
    await this.listarUsuario(id);

    await this.prisma.usuario.delete({
      where: { id },
    });
  }

  //Listar Usuarios x Estado
  async listarUsuariosPorEstado(
    estado: string,
  ): Promise<apiResponse<Usuario[]>> {
    try {
      const usuarios = await this.prisma.usuario.findMany({
        where: { estado },
      });
      return {
        data: usuarios,
        message: 'Usuarios obtenidos exitosamente',
        status: 200,
      };
    } catch (error) {
      throw new BadRequestException(`Error al obtener los usuarios: ${error}`);
    }
  }

  //Actualizar Usuario
  async actualizarUsuario(
    data: Partial<UsuarioUncheckedUpdateInput>,
  ): Promise<apiResponse<Usuario>> {
    try {
      const id = data.id as number;
      await this.listarUsuario(id);

      if (data.email) {
        await this.validarEmail(data.email as string, id);
      }
      if (data.nombreUsuario) {
        await this.validarNombreUsuario(data.nombreUsuario as string, id);
      }

      const usuarioActualizado = await this.prisma.usuario.update({
        where: { id },
        data: {
          ...data,
          password: data.password
            ? await this.bcryptService.hashPassword(data.password as string)
            : undefined,
          email: data.email === null ? undefined : data.email,
          nombreUsuario:
            data.nombreUsuario === null ? undefined : data.nombreUsuario,
        },
      });

      return {
        message: 'Usuario actualizado exitosamente',
        data: usuarioActualizado,
        status: 200,
      };
    } catch (error) {
      throw new BadRequestException(
        `Error al actualizar el usuario: ${error}`,
      );
    }
  }
}
