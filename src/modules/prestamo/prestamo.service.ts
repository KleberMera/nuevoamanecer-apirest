import { Injectable, BadRequestException } from '@nestjs/common';
import { Prestamo, Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { apiResponse } from 'src/shared/models/apiResponse';

@Injectable()
export class PrestamoService {
  constructor(private prisma: PrismaService) {}

  //Funcion para crear un prestamo
  async createPrestamo(
    usuarioId: number,
    data: Omit<Prisma.PrestamoCreateInput, 'usuario'>,
  ): Promise<apiResponse<Prestamo>> {
    try {
      // Validar que el usuario no tenga prestamos activos
      const prestamoExistente = await this.prisma.prestamo.findFirst({
        where: {
          usuarioId: usuarioId,
          estado: 'A',
        },
      });

      if (prestamoExistente) {
        throw new BadRequestException(
          'El usuario ya tiene un prestamo activo',
        );
      }

      const nuevoPrestamo = await this.prisma.prestamo.create({
        data: {
          ...data,
          usuario: {
            connect: { id: usuarioId },
          },
        },
      });
      return {
        data: nuevoPrestamo,
        message: 'Prestamo creado exitosamente',
        status: 201,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Error al crear el prestamo: ${error}`);
    }
  }
}
