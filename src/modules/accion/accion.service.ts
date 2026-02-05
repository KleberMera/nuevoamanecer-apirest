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
  ): Promise<
    apiResponse<
      (Partial<Accion> & {
        utilidadAccion: number;
        utilidadTotal: number;
      })[]
    >
  > {
    try {
      const acciones = await this.prisma.accion.findMany({
        where: { usuarioId, ...(periodo && { periodo }), estado: 'A' },
        select: {
          id: true,
          usuarioId: true,
          numero: true,
          valor: true,
          acumulado: true,
          estado: true,
          fecha: true,
          periodo: true,
        },
      });

      // Enriquecer cada acción con datos de la vista
      const accionesEnriquecidas = await Promise.all(
        acciones.map(async (accion) => {
          const vistaData = await this.prisma.vmDistribucionPeriodos.findFirst({
            where: {
              periodo: accion.periodo,
            },
          });

          return {
            ...accion,
            utilidadAccion: vistaData?.utilidadporaccion || 0,
            utilidadTotal: accion.numero * (vistaData?.utilidadporaccion || 0),
          };
        }),
      );

      return {
        status: 200,
        message: 'Acciones obtenidas exitosamente',
        data: accionesEnriquecidas,
      };
    } catch (error) {
      throw new BadRequestException(`Error al obtener las acciones: ${error}`);
    }
  }

  //Listar acciones por periodo (opcional, si no se proporciona trae todas)
  async listarAccionesPorPeriodo(
    periodo?: string,
  ): Promise<
    apiResponse<
      (Partial<Accion> & {
        usuario?: {
          nombre1: string;
          nombre2: string | null;
          apellido1: string;
          apellido2: string | null;
        };
        utilidadAccion: number;
        utilidadTotal: number;
      })[]
    >
  > {
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

      // Enriquecer cada acción con datos de la vista
      const accionesEnriquecidas = await Promise.all(
        acciones.map(async (accion) => {
          const vistaData = await this.prisma.vmDistribucionPeriodos.findFirst({
            where: {
              periodo: accion.periodo,
            },
          });

          return {
            id: accion.id,
            usuarioId: accion.usuarioId,
            numero: accion.numero,
            valor: accion.valor,
            acumulado: accion.acumulado,
            estado: accion.estado,
            fecha: accion.fecha,
            periodo: accion.periodo,
            usuario: accion.usuario,
            utilidadAccion: vistaData?.utilidadporaccion || 0,
            utilidadTotal: accion.numero * (vistaData?.utilidadporaccion || 0),
          };
        }),
      );

      return {
        status: 200,
        message: 'Acciones obtenidas exitosamente',
        data: accionesEnriquecidas,
      };
    } catch (error) {
      throw new BadRequestException(`Error al obtener las acciones: ${error}`);
    }
  }

  //Total de acciones por usuario, opcional por periodo
  //Ver el valor y el acumulado, con utilidad calculada desde la vista
  async totalAccionesPorUsuario(
    usuarioId: number,
    periodo?: string,
  ): Promise<apiResponse<{ totalNumero: number; totalValor: number; utilidadTotal: number }>> {
    try {
      // Obtener totales de acciones del usuario
      const resultado = await this.prisma.accion.aggregate({
        _sum: {
          numero: true,
          valor: true,
        },
        where: { usuarioId, ...(periodo && { periodo }), estado: 'A' },
      });

      const totalNumero = resultado._sum.numero || 0;
      const totalValor = resultado._sum.valor || 0;

      // Obtener datos de la vista para calcular utilidad
      let utilidadTotal = 0;

      if (periodo) {
        // Si hay periodo, obtener utilidadporaccion para ese periodo específico
        const vistaData = await this.prisma.vmDistribucionPeriodos.findFirst({
          where: {
            periodo: periodo,
          },
        });
        if (vistaData) {
          utilidadTotal = totalNumero * (vistaData.utilidadporaccion || 0);
        }
      } else {
        // Si no hay periodo, sumar la utilidad de todos los periodos donde el usuario tiene acciones
        const acciones = await this.prisma.accion.findMany({
          where: { usuarioId, estado: 'A' },
          select: { periodo: true, numero: true },
          distinct: ['periodo'],
        });

        for (const accion of acciones) {
          const vistaData = await this.prisma.vmDistribucionPeriodos.findFirst({
            where: {
              periodo: accion.periodo,
            },
          });
          if (vistaData) {
            const totalAccionesEnPeriodo = await this.prisma.accion.aggregate({
              _sum: { numero: true },
              where: { usuarioId, periodo: accion.periodo, estado: 'A' },
            });
            utilidadTotal += (totalAccionesEnPeriodo._sum.numero || 0) * (vistaData.utilidadporaccion || 0);
          }
        }
      }

      return {
        status: 200,
        message: 'Totales obtenidos exitosamente',
        data: {
          totalNumero,
          totalValor,
          utilidadTotal,
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
