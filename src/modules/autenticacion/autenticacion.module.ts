import { Module } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { AutenticacionController } from './autenticacion.controller';
import { JwtModule } from '@nestjs/jwt';
import { TokenGuard } from 'src/shared/config/guards/token/token.guard';
import { APP_GUARD } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { BcryptService } from 'src/shared/config/bcrypt/bcrypt.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AutenticacionController],
  providers: [
    AutenticacionService,
    TokenGuard,
    PrismaService,
    BcryptService,
    {
      provide: APP_GUARD,
      useClass: TokenGuard,
    },
  ],
})
export class AutenticacionModule {}
