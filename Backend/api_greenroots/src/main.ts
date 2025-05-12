import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';

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
      'x-csrf-token',
      'XSRF-TOKEN',
    ],
    exposedHeaders: ['x-csrf-token', 'XSRF-TOKEN'],
    credentials: true,
  });

  app.use(cookieParser());

  // Configuration CSRF
  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => console.error('Error starting server:', err));
