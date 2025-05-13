import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';

/**
 * Garde d'authentification qui vérifie si l'utilisateur est authentifié via JWT.
 * Ce garde extrait le token JWT du cookie et valide l'utilisateur.
 * 
 * @example
 * @UseGuards(AuthGuard)
 * @Get('profile')
 * getProfile() {
 *   return { message: 'Profil protégé' };
 * }
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  /**
   * Vérifie si la requête contient un token valide
   * @param context Le contexte d'exécution
   * @returns true si l'utilisateur est authentifié
   * @throws UnauthorizedException si l'utilisateur n'est pas authentifié
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = {
        id: payload.sub,
        role: payload.role,
        email: payload.email,
      };
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  /**
   * Extrait le token JWT du cookie
   * @param request La requête HTTP
   * @returns Le token JWT ou undefined si aucun token n'est trouvé
   */
  private extractTokenFromCookie(request: Request): string | undefined {
    if (request.cookies && request.cookies['access_token']) {
      return request.cookies['access_token'];
    }

    return undefined;
  }
}
