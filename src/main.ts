import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Configurar zona horaria global para Ecuador
process.env.TZ = process.env.TIMEZONE || 'America/Guayaquil';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch(err => console.error(err));
