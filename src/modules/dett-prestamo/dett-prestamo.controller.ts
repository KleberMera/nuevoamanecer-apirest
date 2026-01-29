import { Controller } from '@nestjs/common';
import { DettPrestamoService } from './dett-prestamo.service';

@Controller('dett-prestamo')
export class DettPrestamoController {
  constructor(private readonly dettPrestamoService: DettPrestamoService) {}
}
