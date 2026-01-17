import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { BcryptService } from 'src/shared/config/bcrypt/bcrypt.service';

@Module({
  controllers: [UsuarioController],
  providers: [UsuarioService, PrismaService, BcryptService],
})
export class UsuarioModule {}
