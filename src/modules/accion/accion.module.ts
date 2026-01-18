import { Module } from '@nestjs/common';
import { AccionService } from './accion.service';
import { AccionController } from './accion.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AccionController],
  providers: [AccionService, PrismaService],
})
export class AccionModule {}
