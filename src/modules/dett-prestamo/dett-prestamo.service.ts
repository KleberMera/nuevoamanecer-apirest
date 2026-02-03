import { Injectable } from '@nestjs/common';
import { Prisma, DetallePrestamo } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { apiResponse } from 'src/shared/models/apiResponse';

@Injectable()
export class DettPrestamoService {
  constructor(private prisma: PrismaService) {}

  //Crear un detalle de prestamo por id de prestamo
  async createDettPrestamo(
    prestamoId: number,
    data: Omit<Prisma.DetallePrestamoCreateInput, 'prestamo'>,
  ): Promise<apiResponse<DetallePrestamo>> {
    try {
      const nuevoDettPrestamo = await this.prisma.detallePrestamo.create({
        data: {
          ...data,
          prestamo: {
            connect: { id: prestamoId },
          },
        },
      });
      return {
        data: nuevoDettPrestamo,
        message: 'Detalle de prestamo creado exitosamente',
        status: 201,
      };
    } catch (error) {
      throw new Error(`Error al crear el detalle de prestamo: ${error}`);
    }
  }

  //Actualizar estado de un detalle de prestamo por id
  async updateDettPrestamoStatus(
    id: number,
    nuevoEstado: string,
  ): Promise<apiResponse<DetallePrestamo>> {
    try {
      const dettPrestamoActualizado = await this.prisma.detallePrestamo.update({
        where: { id: id },
        data: { estadoPago: nuevoEstado },
      });

      return {
        data: dettPrestamoActualizado,
        message: 'Cuota de prestamo registrada exitosamente',
        status: 200,
      };
    } catch (error) {
      throw new Error(
        `Error al actualizar el estado del detalle de prestamo: ${error}`,
      );
    }
  }
}
