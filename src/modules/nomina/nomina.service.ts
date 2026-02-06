import { BadRequestException, Injectable } from '@nestjs/common';
import { VmNominaPagosCabecera, VmNominaPagosDetalle } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { apiResponse } from 'src/shared/models/apiResponse';

@Injectable()
export class NominaService {
	constructor(private readonly prisma: PrismaService) {}

	async obtenerNominaPorPeriodo(periodo?: string): Promise<apiResponse<{
		cabNomina: VmNominaPagosCabecera[];
		detNomina: VmNominaPagosDetalle[];
	}>> {
		try {
			const cabNomina = await this.prisma.vmNominaPagosCabecera.findMany({
				where: { ...(periodo && { periodo }) },
			});

			const detNomina = await this.prisma.vmNominaPagosDetalle.findMany({
				where: { ...(periodo && { periodo }) },
			});

			return {
				data: { cabNomina, detNomina },
				message: 'Nómina obtenida exitosamente',
				status: 200,
			};
		} catch (error) {
			throw new BadRequestException(`Error al obtener la nomina: ${error}`);
		}
	}
}
