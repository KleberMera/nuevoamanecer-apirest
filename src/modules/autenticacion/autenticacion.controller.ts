import { Controller, Post, Body } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { Public } from 'src/shared/config/guards/token/token.guard';

@Controller('autenticacion')
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService) {}

  @Public()
  @Post('login')
  async login(@Body() body: { nombreUsuario: string; password: string }) {
    return await this.autenticacionService.login(body.nombreUsuario, body.password);
  }

  @Post('logout')
  async logout() {
    return await this.autenticacionService.logout();
  }
}
