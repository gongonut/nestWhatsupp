import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { urlencoded, json } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';

/*
import { createBot, createProvider, createFlow } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { BotWpService as BotWp} from './bot-wp/bot-wp.service';
*/

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // para servir html desde Express
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.enableCors({
    origin: process.env.ALLOW_PAGES, // ['*'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    // credentials: true
  });

  const config = new DocumentBuilder()
    .setTitle('API tasky server')
    .setDescription('APIs')
    .setVersion('1.0')
    .addTag('email')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  app.useStaticAssets(join(__dirname, '..', 'tasker'), { prefix: "/tasker/" });
  app.useStaticAssets(join(__dirname, '..', 'supplier'), { prefix: "/supplier/" });
  app.useStaticAssets(join(__dirname, '..', 'page'), { prefix: "/page/" });
  app.useStaticAssets(join(__dirname, '..', 'tasker'), { prefix: "/" });

  await app.listen(process.env.PORT ?? 3000);

  // Wathsupp bot
  

  // httpServer()
}

bootstrap();
