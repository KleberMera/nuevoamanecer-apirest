import { Body, Controller, Get, Post } from '@nestjs/common';
import { RolService } from './rol.service';
import { Prisma } from 'src/generated/prisma/client';
import { Public } from 'src/shared/config/guards/token/token.guard';

@Controller('rol')
export class RolController {
  constructor(private readonly rolService: RolService) {}
  @Public()
  @Post('') async createRol(@Body() data: Prisma.RolCreateInput) {
    return this.rolService.createRol(data);
  }

  @Get('') async getAllRoles() {
    return this.rolService.getAllRoles();
  }
}
