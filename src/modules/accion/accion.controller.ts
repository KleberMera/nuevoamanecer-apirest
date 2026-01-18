import { Controller } from '@nestjs/common';
import { AccionService } from './accion.service';

@Controller('accion')
export class AccionController {
  constructor(private readonly accionService: AccionService) {}
}
