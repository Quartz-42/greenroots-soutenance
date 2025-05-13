import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './role.enum';

/**
 * Garde qui vérifie si l'utilisateur possède les rôles requis pour accéder à une ressource.
 * Utilisé avec le décorateur @Roles() sur les contrôleurs ou les méthodes.
 *
 * @example
 * @Roles(Role.Admin)
 * @UseGuards(RolesGuard)
 * @Get('admin-only')
 * getAdminData() {
 *   return { data: 'Admin only data' };
 * }
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Vérifie si l'utilisateur a les rôles requis
   * @param context Le contexte d'exécution
   * @returns true si l'utilisateur a les permissions requises
   * @throws ForbiddenException si l'utilisateur n'a pas les permissions
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    console.log('Required roles:', requiredRoles);
    console.log('User from request:', user);

    if (!user || !user.role) {
      console.log('No user or role found in request');
      throw new ForbiddenException('Accès refusé : aucun rôle trouvé.');
    }

    const hasRole = requiredRoles.some((role) => role === user.role);
    console.log('Has required role:', hasRole);

    return hasRole;
  }
}
