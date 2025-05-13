import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import { NextFunction, Request, Response } from 'express';
// Importer Request pour l'utiliser dans l'option value (bien que ce soit le défaut)
// import { Request } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5556',
      'https://localhost:5556',
      'http://greenroots.jordan-s.org',
      'https://greenroots.jordan-s.org',
      'https://7a83-2a01-cb15-11-6800-ac4d-297-eee7-2fb2.ngrok-free.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Access-Control-Allow-Origin',
      'x-csrf-token', // Important: autoriser cet en-tête
      'XSRF-TOKEN',
    ],
    exposedHeaders: ['x-csrf-token', 'XSRF-TOKEN'], // Exposer l'en-tête si nécessaire (normalement pas)
    credentials: true,
  });

  // Utiliser cookieParser AVEC un secret.
  // !! IMPORTANT !! : Remplacez 'votre-secret-cookie-super-secret' par une vraie clé secrète
  // stockée de manière sécurisée (ex: variable d'environnement process.env.COOKIE_SECRET)
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

  // Middleware pour gérer les erreurs CSRF spécifiquement (optionnel mais recommandé)
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.code === 'EBADCSRFTOKEN') {
      res.status(403).json({ message: 'Invalid CSRF token' });
    } else {
      next(err);
    }
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => console.error('Error starting server:', err));
