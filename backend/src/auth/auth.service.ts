
import { Injectable, UnauthorizedException, InternalServerErrorException, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class AuthService implements OnModuleInit, OnModuleDestroy {
    
    private supabaseClient!: SupabaseClient;
    private redisClient!: RedisClientType;

    constructor(private configService: ConfigService) { }

    async onModuleInit() {
        this.supabaseClient = createSupabaseClient(
            this.configService.get<string>('SUPABASE_URL')!,
            this.configService.get<string>('SUPABASE_SERVICE_KEY')!
        );

        this.redisClient = createClient({
            socket: {
                host: this.configService.get<string>('REDIS_HOST'),
                port: this.configService.get<number>('REDIS_PORT'),
            },
            password: this.configService.get<string>('REDIS_PASSWORD')
        });

        this.redisClient.on('error', (err) => {
            console.error('Error Redis:', err);
        });

        await this.redisClient.connect();
        console.log('Servicios de Auth inicializados');
    }

    async onModuleDestroy() {
        await this.redisClient.quit();
    }

    public async register(email: string, password: string) {
        console.log('Intento de registro para:', email);
        const { data, error } = await this.supabaseClient.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            throw new InternalServerErrorException(`Error al registrar: ${error.message}`);
        }

        return {
            user: data.user,
            message: 'Usuario registrado exitosamente. Verifique su correo para confirmar.'
        };
    }

    public async login(email: string, password: string) {
        console.log('Intento de login para:', email);
        const { data, error } = await this.supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            console.error('Error login Supabase:', error.message);
            throw new UnauthorizedException(`Credenciales incorrectas o usuario no verificado. Error: ${error.message}`);
        }

        return data.session;
    }

    public async refresh(refreshToken: string) {
        console.log('Refrescando token...');
        const { data, error } = await this.supabaseClient.auth.refreshSession({
            refresh_token: refreshToken,
        });

        if (error) {
            throw new UnauthorizedException('Token de refresco inválido o expirado');
        }

        return data.session;
    }

    public async logout(token: string) {
        const accessToken = token.split(' ')[1];

        try {
            const payloadBase64 = accessToken.split('.')[1];
            const decodedPayload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));
            const exp = decodedPayload.exp;

            const now = Math.floor(Date.now() / 1000);
            const expiresInSeconds = exp - now;

            if (expiresInSeconds > 0) {
                await this.redisClient.set(`blacklist:${accessToken}`, 'true', {
                    EX: expiresInSeconds + 30
                });
            }

            await this.supabaseClient.auth.signOut();

            return { message: 'Sesión cerrada correctamente' };
        } catch (err) {
            console.error('Error en logout:', err);
            throw new InternalServerErrorException('Error al cerrar sesión');
        }
    }

    public async passwordRecovery(email: string) {
        const { error } = await this.supabaseClient.auth.resetPasswordForEmail(email);

        if (error) {
            throw new InternalServerErrorException(`Error al enviar correo de recuperación: ${error.message}`);
        }

        return { message: 'Correo de recuperación enviado exitosamente' };
    }
}