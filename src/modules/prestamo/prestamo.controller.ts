import { Controller } from '@nestjs/common';
import { PrestamoService } from './prestamo.service';

@Controller('prestamo')
export class PrestamoController {
  constructor(private readonly prestamoService: PrestamoService) {}
}
