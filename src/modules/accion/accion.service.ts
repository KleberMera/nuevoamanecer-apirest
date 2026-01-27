import { BadRequestException, Injectable } from '@nestjs/common';
import { Accion } from 'src/generated/prisma/client';
import { AccionCreateInput, AccionUncheckedUpdateInput } from 'src/generated/prisma/models';
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
          periodo: true,
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

  //Total de acciones por usuario, opcional por periodo
  //Ver el valor y el acumulado
  async totalAccionesPorUsuario(
    usuarioId: number,
    periodo?: string,
  ): Promise<apiResponse<{ totalNumero: number; totalValor: number }>> {
    try {
      const resultado = await this.prisma.accion.aggregate({
        _sum: {
          numero: true,
          valor: true,
        },
        where: { usuarioId, ...(periodo && { periodo }) },
      });
      return {
        status: 200,
        message: 'Totales obtenidos exitosamente',
        data: {
          totalNumero: resultado._sum.numero || 0,
          totalValor: resultado._sum.valor || 0,
        },
      };
    } catch (error) {
      throw new BadRequestException(`Error al obtener los totales: ${error}`);
    }
  }

  //Actualizar accion por id de usuario
  async actualizarAccion(
    id: number,
    data: Partial<AccionUncheckedUpdateInput>,
  ): Promise<apiResponse<Accion>> {
    try {
      await this.prisma.accion.findUniqueOrThrow({
        where: { id },
      });
      const updatedAccion = await this.prisma.accion.update({
        where: { id },
        data,
      });
      return {
        status: 200,
        message: 'Accion actualizada exitosamente',
        data: updatedAccion,
      };
    } catch (error) {
      throw new BadRequestException(`Error al actualizar la accion: ${error}`);
    }
  }
}
