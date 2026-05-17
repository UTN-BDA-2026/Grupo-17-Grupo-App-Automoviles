
import { Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth') 
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body.email, body.password);
  }

  @Post('login')
  async login(@Body() body: any) {
    return this.authService.login(body.email, body.password);
  }

  @Post('refresh')
  async refresh(@Body() body: any) {
    return this.authService.refresh(body.refreshToken);
  }

  @Post('logout')
  async logout(@Headers('authorization') authHeader: string) {
    if (!authHeader) throw new UnauthorizedException('Token no provisto');
    const token = authHeader.split(' ')[1]; 
    return this.authService.logout(token);
  }

  @Post('password-recovery')
  async passwordRecovery(@Body() body: any) {
    return this.authService.passwordRecovery(body.email);
  }
}