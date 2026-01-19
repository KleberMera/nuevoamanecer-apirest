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

  //Listar acciones por id de usuario
  async listarAccionesPorUsuario(
    usuarioId: number,
  ): Promise<apiResponse<Accion[]>> {
    try {
      const acciones = await this.prisma.accion.findMany({
        where: { usuarioId },
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
