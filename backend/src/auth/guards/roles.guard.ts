import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserRole } from '../../users/user.entity';
import { AuthService } from '../auth.service';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Verifica que el usuario autenticado tenga uno de los roles requeridos por
 * @Roles(...). Debe ejecutarse DESPUÉS de JwtAuthGuard (que deja request['user']).
 * El rol vive en la DB local; se consulta vía AuthService (exportado, igual que
 * JwtAuthGuard) para resolverse correctamente en cualquier módulo.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authUser = request['user'] as { id?: string } | undefined;

    if (!authUser?.id) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    const user = await this.authService.getLocalUserById(authUser.id);
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('No tenés permisos para acceder a este recurso');
    }

    return true;
  }
}
