import { BadRequestException, Injectable } from '@nestjs/common';
import { Accion } from 'src/generated/prisma/client';
import { AccionCreateInput } from 'src/generated/prisma/models';
import { PrismaService } from 'src/prisma/prisma.service';
import { apiResponse } from 'src/shared/models/apiResponse';

@Injectable()
export class AccionService {
  constructor(readonly prisma: PrismaService) {}

  //Crear Accion

  async createAccion(data: AccionCreateInput): Promise<apiResponse<Accion>> {
    try {
      const newAccion = await this.prisma.accion.create({
        data,
      });
      return {
        status: 201,
        message: 'Accion registrada exitosamente',
        data: newAccion,
      };
    } catch (error) {
      throw new BadRequestException(`Error al crear el Accion: ${error}`);
    }
  }

  //Listar acciones por id de usuario (con periodo opcional)
  async listarAccionesPorUsuario(
    usuarioId: number,
    periodo?: string,
  ): Promise<apiResponse<Partial<Accion>[]>> {
    try {
      const acciones = await this.prisma.accion.findMany({
        where: { usuarioId, ...(periodo && { periodo }) },
        select: {
          id: true,
          usuarioId: true,
          numero: true,
          valor: true,
          acumulado: true,
          estado: true,
          fecha: true,
          // usuario: {
          //   select: {
          //     nombre1: true,
          //     nombre2: true,
          //     apellido1: true,
          //     apellido2: true,
          //   },
          // },
        },
      });
      return {
        status: 200,
        message: 'Acciones obtenidas exitosamente',
        data: acciones,
      };
    } catch (error) {
      throw new BadRequestException(`Error al obtener las acciones: ${error}`);
    }
  }

  //Listar acciones por periodo (opcional, si no se proporciona trae todas)
  async listarAccionesPorPeriodo(
    periodo?: string,
  ): Promise<apiResponse<Partial<Accion>[]>> {
    try {
      const acciones = await this.prisma.accion.findMany({
        where: periodo ? { periodo } : {},
        select: {
          id: true,
          usuarioId: true,
          numero: true,
          valor: true,
          acumulado: true,
          estado: true,
          fecha: true,
          usuario: {
            select: {
              nombre1: true,
              nombre2: true,
              apellido1: true,
              apellido2: true,
            },
          },
        },
      });
      return {
        status: 200,
        message: 'Acciones obtenidas exitosamente',
        data: acciones,
      };
    } catch (error) {
      throw new BadRequestException(`Error al obtener las acciones: ${error}`);
    }
  }
}
