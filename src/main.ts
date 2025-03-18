import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Configura el prefijo global para las rutas
  app.setGlobalPrefix('api');

  // Habilitar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const options = new DocumentBuilder()
  .setTitle('API de ejemplo')
  .setDescription('Documentación de la API')
  .setVersion('1.0')
  .addBearerAuth()  // Aquí se indica que se usará Bearer Auth
  .build();

const document = SwaggerModule.createDocument(app, options);
SwaggerModule.setup('api', app, document);

  // Iniciar el servidor en el puerto configurado
  await app.listen(process.env.PORT || 3001);
  logger.log(`App running on port ${process.env.PORT || 3001}`);
}

bootstrap();
