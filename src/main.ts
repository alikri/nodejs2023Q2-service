import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const options = new DocumentBuilder()
    .setTitle('Example API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  if (!fs.existsSync('./doc')) {
    fs.mkdirSync('./doc');
  }

  fs.writeFileSync(
    './doc/openapi-spec.json',
    JSON.stringify(document, null, 2),
  );

  await app.listen(4000);
}
bootstrap();
