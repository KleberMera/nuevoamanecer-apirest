import { Controller } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';

@Controller('autenticacion')
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService) {}
}
