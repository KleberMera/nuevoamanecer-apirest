import { Injectable } from '@nestjs/common';
import { Prestamo, Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { apiResponse } from 'src/shared/models/apiResponse';

@Injectable()
export class PrestamoService {
  constructor(private prisma: PrismaService) {}

  //Funcion para crear un prestamo
  async createPrestamo(
    data: Prisma.PrestamoCreateInput,
  ): Promise<apiResponse<Prestamo>> {
    try {
      const nuevoPrestamo = await this.prisma.prestamo.create({
        data,
      });
      return {
        data: nuevoPrestamo,
        message: 'Prestamo creado exitosamente',
        status: 201,
      };
    } catch (error) {
      throw new Error(`Error al crear el prestamo: ${error}`);
    }
  }
}
