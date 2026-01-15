import { Body, Controller, Get, Post } from '@nestjs/common';
import { RolService } from './rol.service';
import { Prisma } from 'src/generated/prisma/client';

@Controller('rol')
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Post() async createRol(@Body() data: Prisma.RolCreateInput) {
    return this.rolService.createRol(data);
  }

  @Get('todo') async getAllRoles() {
    return this.rolService.getAllRoles();
  }
}
