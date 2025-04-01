import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

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
