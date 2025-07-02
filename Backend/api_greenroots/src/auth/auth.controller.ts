import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  Get,
  Req,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiHeader } from '@nestjs/swagger';

@ApiTags('authentification')
@Controller('')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  private isTestEnvironment: boolean;

  constructor(private authService: AuthService) {
    // Détecte si nous sommes en environnement de test
    this.isTestEnvironment =
      process.env.NODE_ENV === 'test' ||
      process.env.JEST_WORKER_ID !== undefined;
  }

  // Méthode pour logger uniquement en dehors des tests
  private log(message: string): void {
    if (!this.isTestEnvironment) {
      this.logger.log(message);
    }
  }

  // Méthode pour logger les erreurs uniquement en dehors des tests
  private logError(message: string): void {
    if (!this.isTestEnvironment) {
      this.logger.error(message);
    }
  }

  @ApiOperation({ summary: 'Obtenir un token CSRF' })
  @ApiResponse({
    status: 200,
    description: 'Token CSRF généré avec succès',
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          example: 'csrf-token-example',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur lors de la génération du token',
  })
  @Get('csrf-token')
  getCsrfToken(@Req() req: Request) {
    try {
      const token = req.csrfToken();
      this.log(
        `Token CSRF généré: ${token.substring(0, 8)}... - ${new Date().toISOString()}`,
      );
      return { token: token };
    } catch (error) {
      this.logError(
        `Erreur lors de la génération du token CSRF: ${error.message} - ${new Date().toISOString()}`,
      );
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Connexion utilisateur' })
  @ApiHeader({
    name: 'X-CSRF-Token',
    description: 'Token CSRF requis pour la sécurité',
    required: true,
    example: 'csrf-token-example'
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        email: { type: 'string', example: 'utilisateur@example.com' },
        name: { type: 'string', example: 'Utilisateur Exemple' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Identifiants invalides' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    signInDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      this.log(
        `Tentative de connexion pour l'email: ${signInDto.email} - ${new Date().toISOString()}`,
      );
      const { access_token, user } = await this.authService.login(
        signInDto.email,
        signInDto.password,
      );
      res.cookie('access_token', access_token, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: process.env.NODE_ENV === 'production' ? 3600000 : 86400000
      });
      this.log(
        `Connexion réussie pour l'utilisateur: ${user.id} - ${new Date().toISOString()}`,
      );
      res.send(user);
    } catch (error) {
      this.logError(
        `Erreur de connexion pour l'email: ${signInDto.email}: ${error.message} - ${new Date().toISOString()}`,
      );
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Inscription nouvel utilisateur' })
  @ApiHeader({
    name: 'X-CSRF-Token',
    description: 'Token CSRF requis pour la sécurité',
    required: true,
    example: 'csrf-token-example'
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur créé avec succès',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        email: { type: 'string', example: 'utilisateur@example.com' },
        name: { type: 'string', example: 'Utilisateur Exemple' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Erreur lors de la création de l'utilisateur",
  })
  @HttpCode(HttpStatus.OK)
  @Post('register')
  signUp(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    signUpDto: RegisterDto,
  ) {
    try {
      const result = this.authService.register(
        signUpDto.email,
        signUpDto.password,
        signUpDto.name,
      );
      return result;
    } catch (error) {
      this.logError(
        `Erreur d'inscription pour l'email: ${signUpDto.email}: ${error.message} - ${new Date().toISOString()}`,
      );
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Déconnexion utilisateur' })
  @ApiHeader({
    name: 'X-CSRF-Token',
    description: 'Token CSRF requis pour la sécurité',
    required: true,
    example: 'csrf-token-example'
  })
  @ApiResponse({
    status: 200,
    description: 'Déconnexion réussie',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Déconnexion réussie',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Erreur lors de la déconnexion' })
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    try {
      res.clearCookie('access_token', {
        httpOnly: true,
        sameSite: 'lax',
      });
      return { message: 'Déconnexion réussie' };
    } catch (error) {
      this.logError(
        `Erreur lors de la déconnexion: ${error.message} - ${new Date().toISOString()}`,
      );
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
