import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import { NextFunction, Request, Response } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('API Green Roots')
    .setDescription("Documentation de l'API Green Roots")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: ['http://localhost:5556', 'https://localhost:5556'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Access-Control-Allow-Origin',
      'x-csrf-token', // Important: autoriser cet en-tête
      'XSRF-TOKEN',
      'cache-control',
    ],
    exposedHeaders: ['x-csrf-token', 'XSRF-TOKEN'],
    credentials: true,
  });

  // Utiliser cookieParser AVEC un secret.
  app.use(
    cookieParser(
      process.env.COOKIE_SECRET || 'votre-secret-cookie-super-secret',
    ),
  );

  // Configuration CSRF
  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
      },
    }),
  );

  // Middleware pour gérer les erreurs CSRF spécifiquement
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.code === 'EBADCSRFTOKEN') {
      res.status(403).json({ message: 'Invalid CSRF token' });
    } else {
      next(err);
    }
  });
  await app.listen(process.env.PORT ?? 3000);

  // Hot Module Replacement
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap().catch((err) => console.error('Error starting server:', err));
