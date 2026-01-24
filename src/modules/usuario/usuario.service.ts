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

  private async validarNombreUsuario(
    nombreUsuario: string,
    idUsuario?: number,
  ) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { nombreUsuario },
      select: { nombreUsuario: true, id: true },
    });
    if (!usuario) return;
    if (idUsuario && usuario.id === idUsuario) return;
    throw new Error('El nombre de usuario ya está en uso');
  }

  private async validarCedula(cedula: string, idUsuario?: number) {
    if (!cedula || cedula.trim() === '') {
      throw new Error('La cédula no puede estar vacía');
    }
    if (!/^\d+$/.test(cedula)) {
      throw new Error('La cédula debe contener solo números');
    }
    if (cedula.length < 8) {
      throw new Error('La cédula debe tener al menos 8 dígitos');
    }

    const usuario = await this.prisma.usuario.findUnique({
      where: { cedula },
      select: { cedula: true, id: true },
    });
    if (!usuario) return;
    if (idUsuario && usuario.id === idUsuario) return;
    throw new Error('La cédula ya está en uso');
  }

  //crear usuario
  async createUsuario(data: UsuarioCreateInput): Promise<apiResponse<Usuario>> {
    try {
      if (data.email) {
        await this.validarEmail(data.email);
      }
      await this.validarNombreUsuario(data.nombreUsuario);
      if (data.cedula) {
        await this.validarCedula(data.cedula);
      }
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
      throw new BadRequestException(`${error}`);
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
  ): Promise<apiResponse<Partial<Usuario>[]>> {
    try {
      const usuarios = await this.prisma.usuario.findMany({
        where: { estado },
        select: {
           id: true,
          nombre1: true,
          nombre2: true,
          apellido1: true,
          apellido2: true,
          nombreUsuario: true,
          cedula: true,
          telefono: true, 
          email: true,
          estado: true,
          rol: {
            select: {
              id: true,
              nombre: true,
            }
          }
        },
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
      if (data.cedula) {
        await this.validarCedula(data.cedula as string, id);
      }

      const usuarioActualizado = await this.prisma.usuario.update({
        where: { id },
        data: {
          ...data,
          password: data.password
            ? await this.bcryptService.hashPassword(data.password as string)
            : undefined,
          email: data.email === null ? undefined : (data.email as string),
          nombreUsuario:
            data.nombreUsuario === null
              ? undefined
              : (data.nombreUsuario as string),
          cedula: data.cedula === null ? undefined : (data.cedula as string),
        },
      });

      return {
        message: 'Usuario actualizado exitosamente',
        data: usuarioActualizado,
        status: 200,
      };
    } catch (error) {
      throw new BadRequestException(`Error al actualizar el usuario: ${error}`);
    }
  }
}
