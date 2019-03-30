import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { UserModule } from './api/user/user.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const options = new DocumentBuilder()
    .setTitle('Chat example')
    .setDescription('The chat API description')
    .setVersion('1.0')
    .addTag('users')
    .addBearerAuth()
    .build();

    const document = SwaggerModule.createDocument(app, options, {
      include: [UserModule],
    });
    SwaggerModule.setup('doc', app, document);

    app.useWebSocketAdapter(new WsAdapter(app));
    app.useStaticAssets(join(__dirname, '..', 'files'));
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
    console.log('app listening on port 3000');
  } catch (error) {
    console.error(error);
  }
}
bootstrap();
