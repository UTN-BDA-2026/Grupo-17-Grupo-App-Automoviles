import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('usuarios')
@ApiBearerAuth('jwt')
@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Obtener el perfil del usuario autenticado',
    description: 'Devuelve los datos del usuario actual (incluye su rol).',
  })
  @ApiOkResponse({ description: 'Perfil del usuario.' })
  @ApiUnauthorizedResponse({ description: 'Token no provisto, inválido o expirado.' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado.' })
  getMe(@CurrentUser() user: { id: string }) {
    return this.usersService.getProfile(user.id);
  }

  @Patch('me')
  @ApiOperation({
    summary: 'Actualizar el perfil del usuario autenticado',
    description: 'Actualiza las preferencias del usuario actual.',
  })
  @ApiOkResponse({ description: 'Perfil actualizado.' })
  @ApiUnauthorizedResponse({ description: 'Token no provisto, inválido o expirado.' })
  updateMe(@CurrentUser() user: { id: string }, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, dto);
  }
}
