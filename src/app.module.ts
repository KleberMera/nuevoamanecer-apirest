import { NominaModule } from './modules/nomina/nomina.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { RolModule } from './modules/rol/rol.module';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { AutenticacionModule } from './modules/autenticacion/autenticacion.module';
import { ConfigModule } from '@nestjs/config';
import { AccionModule } from './modules/accion/accion.module';
import { PrestamoModule } from './modules/prestamo/prestamo.module';
import { DettPrestamoModule } from './modules/dett-prestamo/dett-prestamo.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RolModule, UsuarioModule, AutenticacionModule, AccionModule, PrestamoModule, DettPrestamoModule, NominaModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
