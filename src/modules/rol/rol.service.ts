// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Rol } from 'src/generated/prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { apiResponse } from 'src/shared/models/apiResponse';

@Injectable()
export class RolService {
  constructor(private prisma: PrismaService) {}

  //Crear Rol
  async createRol(
    data: Prisma.RolCreateInput,
  ): Promise<apiResponse<Rol>> {
    try {
      // Verificar si el rol ya existe
      const rolExistente = await this.prisma.rol.findUnique({
        where: { nombre: data.nombre },
      });

      if (rolExistente) {
        throw new Error(`El rol "${data.nombre}" ya existe`);
      }

      const nuevoRol = await this.prisma.rol.create({
        data,
      });
      return {
        data: nuevoRol,
        message: 'Rol creado exitosamente',
        status: 201,
      };
    } catch (error) {
      throw new BadRequestException(`Error al crear el rol: ${error}`);
    }
  }

  //Listar Roles
  async getAllRoles(): Promise<{
    data: Rol[];
    message: string;
    status: number;
  }> {
    try {
      const roles = await this.prisma.rol.findMany();
      return {
        data: roles,
        message: 'Roles obtenidos exitosamente',
        status: 200,
      };
    } catch (error) {
      throw new BadRequestException(`Error al obtener los roles: ${error}`);
    }
  }
}
