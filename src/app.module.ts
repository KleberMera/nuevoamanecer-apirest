import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { RolModule } from './modules/rol/rol.module';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { AutenticacionModule } from './modules/autenticacion/autenticacion.module';

@Module({
  imports: [
    
    RolModule, UsuarioModule, AutenticacionModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
