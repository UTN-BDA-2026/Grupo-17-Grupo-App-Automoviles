import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/user.entity';

export const ROLES_KEY = 'roles';

/** Marca un handler/controller con los roles permitidos. */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
