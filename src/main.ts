import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import * as https from "https";
import * as fs from "fs";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("Bootstrap");

  const httpsOptions = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH || "./secrets/cert.key"),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH || "./secrets/cert.crt"),
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
  
  // Iniciar servidor HTTPS
  https.createServer(httpsOptions, app.getHttpAdapter().getInstance()).listen(port, () => {
    logger.log(`Servidor HTTPS en https://localhost:${port}`);
  });
}

bootstrap();
