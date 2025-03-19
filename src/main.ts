import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import * as https from "https";
import * as fs from "fs";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("Bootstrap");

  // Obtener rutas desde variables de entorno
  const sslKeyPath = process.env.SSL_KEY_PATH;
  const sslCertPath = process.env.SSL_CERT_PATH;
  const sslCaBundlePath = process.env.SSL_CA_BUNDLE_PATH;

  // Log para verificar las rutas de los archivos
  logger.log(`SSL_KEY_PATH: ${sslKeyPath}`);
  logger.log(`SSL_CERT_PATH: ${sslCertPath}`);
  logger.log(`SSL_CA_BUNDLE_PATH: ${sslCaBundlePath}`);

  const httpsOptions = {
    key: fs.readFileSync(sslKeyPath),
    cert: fs.readFileSync(sslCertPath),
    ca: sslCaBundlePath ? fs.readFileSync(sslCaBundlePath) : undefined,
  };

  // Configura el prefijo global para las rutas
  app.setGlobalPrefix("api");

  // Habilitar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // Configurar Swagger
  const options = new DocumentBuilder()
    .setTitle("API de ejemplo")
    .setDescription("Documentación de la API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api", app, document);

  const port = process.env.PORT || 3001;
  
  // Iniciar servidor HTTPS con .ca-bundle
  https.createServer(httpsOptions, app.getHttpAdapter().getInstance()).listen(port, () => {
    logger.log(`Servidor HTTPS en https://localhost:${port}`);
  });
}

bootstrap();
