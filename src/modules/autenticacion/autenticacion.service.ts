import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { BcryptService } from 'src/shared/config/bcrypt/bcrypt.service';
import { apiResponse } from 'src/shared/models/apiResponse';

@Injectable()
export class AutenticacionService {
  constructor(
    private prisma: PrismaService,
    private bcryptService: BcryptService,
    private jwtService: JwtService,
  ) {}

  async login(nombreUsuario: string, password: string): Promise<apiResponse<Omit<any, 'password'>>> {
    if (!nombreUsuario || !password) {
      throw new BadRequestException('El nombre de usuario y la contraseña son requeridos');
    }

    const usuario = await this.prisma.usuario.findUnique({
      where: { nombreUsuario },
    });

    if (!usuario) {
      throw new UnauthorizedException('Nombre de usuario o contraseña incorrectos');
    }

    if (usuario.estado !== 'A') {
      throw new UnauthorizedException('El usuario está inactivo');
    }

    const passwordValida = await this.bcryptService.comparePassword(password, usuario.password);

    if (!passwordValida) {
      throw new UnauthorizedException('Nombre de usuario o contraseña incorrectos');
    }

    const payload = { sub: usuario.id, nombreUsuario: usuario.nombreUsuario };
    const access_token = await this.jwtService.signAsync(payload);

    const usuarioSinPassword = { ...usuario } as Partial<typeof usuario>;
    delete usuarioSinPassword.password;

    return {
      message: 'Login exitoso',
      data: usuarioSinPassword as Omit<any, 'password'>,
      access_token,
      status: 200,
    };
  }

  logout(): Promise<apiResponse<null>> {
    return Promise.resolve({
      message: 'Sesión cerrada exitosamente',
      status: 200,
    });
  }
}
