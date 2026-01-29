import { Module } from '@nestjs/common';
import { DettPrestamoService } from './dett-prestamo.service';
import { DettPrestamoController } from './dett-prestamo.controller';

@Module({
  controllers: [DettPrestamoController],
  providers: [DettPrestamoService],
})
export class DettPrestamoModule {}
