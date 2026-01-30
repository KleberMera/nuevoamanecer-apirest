import { Module } from '@nestjs/common';
import { DettPrestamoService } from './dett-prestamo.service';
import { DettPrestamoController } from './dett-prestamo.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [DettPrestamoController],
  providers: [DettPrestamoService, PrismaService],
})
export class DettPrestamoModule {}
