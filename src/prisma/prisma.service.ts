import 'dotenv/config';
//import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma/client';

//@Global()
@Injectable()
//export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
export class PrismaService extends PrismaClient  {
  constructor() {
    const databaseUrl = process.env.DATABASE_URL as string;
    console.log('🔧 PrismaService inicializado');
    console.log('📡 DATABASE_URL:', databaseUrl);
    
    if (!databaseUrl) {
      console.error('❌ ERROR: DATABASE_URL no está definido. Verifica tu archivo .env');
      throw new Error('DATABASE_URL is not defined');
    }

    const adapter = new PrismaPg({
      connectionString: databaseUrl,
    });
    super({ adapter });
  }

  // async onModuleInit() {
  //   console.log('⏳ Intentando conectar a la base de datos...');
  //   try {
  //     await this.$connect();
  //     console.log('✅ Conectado a PostgreSQL exitosamente');
  //   } catch (error) {
  //     console.error('❌ Error al conectar a la base de datos:', error);
  //     throw error;
  //   }
  // }

  // async onModuleDestroy() {
  //   console.log('🛑 Desconectando de la base de datos...');
  //   await this.$disconnect();
  //   console.log('✅ Desconectado de la base de datos');
  // }
}