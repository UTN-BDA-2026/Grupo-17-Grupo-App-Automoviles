
import { Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { PasswordRecoveryDto } from './dto/password-recovery.dto';

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto.email, dto.password);
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto.email, dto.password);
    }

    @Post('refresh')
    async refresh(@Body() dto: RefreshDto) {
        return this.authService.refresh(dto.refreshToken);
    }

    @Post('logout')
    async logout(@Headers('authorization') authHeader: string) {
        if (!authHeader?.startsWith('Bearer ')) {
            throw new UnauthorizedException('Token no provisto');
        }
        const token = authHeader.split(' ')[1];
        return this.authService.logout(token);
    }

    @Post('password-recovery')
    async passwordRecovery(@Body() dto: PasswordRecoveryDto) {
        return this.authService.passwordRecovery(dto.email);
    }
}
