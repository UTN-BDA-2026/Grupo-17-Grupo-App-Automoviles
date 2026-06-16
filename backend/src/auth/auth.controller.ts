import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { PasswordRecoveryDto } from './dto/password-recovery.dto';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrar un nuevo usuario',
    description:
      'Crea el usuario en Supabase y un registro local con rol "User". Según la configuración, ' +
      'puede requerir verificación por correo antes de poder iniciar sesión.',
  })
  @ApiCreatedResponse({ description: 'Usuario registrado (con o sin sesión según verificación).' })
  @ApiInternalServerErrorResponse({ description: 'Error al registrar el usuario.' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Devuelve la sesión de Supabase (access token + refresh token).',
  })
  @ApiOkResponse({ description: 'Sesión iniciada; devuelve los tokens.' })
  @ApiUnauthorizedResponse({ description: 'Credenciales incorrectas o usuario no verificado.' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refrescar la sesión',
    description: 'Genera una nueva sesión a partir de un refresh token válido.',
  })
  @ApiOkResponse({ description: 'Nueva sesión generada.' })
  @ApiUnauthorizedResponse({ description: 'Refresh token inválido o expirado.' })
  async refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Cerrar sesión',
    description:
      'Revoca el token enviado en el header Authorization (lo agrega a la blacklist en Redis).',
  })
  @ApiOkResponse({ description: 'Sesión cerrada correctamente.' })
  @ApiUnauthorizedResponse({ description: 'Token no provisto.' })
  async logout(@Headers('authorization') authHeader: string) {
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no provisto');
    }
    const token = authHeader.split(' ')[1];
    return this.authService.logout(token);
  }

  @Post('password-recovery')
  @ApiOperation({
    summary: 'Solicitar recuperación de contraseña',
    description: 'Envía un correo de recuperación de contraseña al email indicado.',
  })
  @ApiOkResponse({ description: 'Correo de recuperación enviado.' })
  @ApiInternalServerErrorResponse({ description: 'Error al enviar el correo de recuperación.' })
  async passwordRecovery(@Body() dto: PasswordRecoveryDto) {
    return this.authService.passwordRecovery(dto.email);
  }
}
