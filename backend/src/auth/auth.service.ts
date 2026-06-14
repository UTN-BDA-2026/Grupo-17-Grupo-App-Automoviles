
import { Injectable, UnauthorizedException, InternalServerErrorException, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';
import { createClient, RedisClientType } from 'redis';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService implements OnModuleInit, OnModuleDestroy {

    private supabaseClient!: SupabaseClient;
    private redisClient!: RedisClientType;

    constructor(
        private configService: ConfigService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

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

    public async verifyToken(token: string) {
        const isBlacklisted = await this.redisClient.get(`blacklist:${token}`);
        if (isBlacklisted) {
            throw new UnauthorizedException('Token revocado');
        }

        const { data, error } = await this.supabaseClient.auth.getUser(token);
        if (error || !data.user) {
            throw new UnauthorizedException('Token inválido o expirado');
        }

        return data.user;
    }

    public async register(email: string, password: string) {
        const { data, error } = await this.supabaseClient.auth.signUp({ email, password });

        if (error) {
            throw new InternalServerErrorException(`Error al registrar: ${error.message}`);
        }

        const supabaseUser = data.user!;
        const existing = await this.userRepository.findOne({ where: { id: supabaseUser.id } });

        if (!existing) {
            const newUser = this.userRepository.create({
                id: supabaseUser.id,
                email: supabaseUser.email!,
            });
            await this.userRepository.save(newUser);
        }

        return {
            user: supabaseUser,
            session: data.session ?? null,
            message: data.session
                ? 'Usuario registrado exitosamente.'
                : 'Usuario registrado. Verifique su correo para confirmar antes de iniciar sesión.',
        };
    }

    public async login(email: string, password: string) {
        const { data, error } = await this.supabaseClient.auth.signInWithPassword({ email, password });

        if (error) {
            throw new UnauthorizedException(`Credenciales incorrectas o usuario no verificado. Error: ${error.message}`);
        }

        return data.session;
    }

    public async refresh(refreshToken: string) {
        const { data, error } = await this.supabaseClient.auth.refreshSession({
            refresh_token: refreshToken,
        });

        if (error) {
            throw new UnauthorizedException('Token de refresco inválido o expirado');
        }

        return data.session;
    }

    public async logout(token: string) {
        try {
            const payloadBase64 = token.split('.')[1];
            const decodedPayload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));
            const exp: number = decodedPayload.exp;
            const userId: string = decodedPayload.sub;

            const now = Math.floor(Date.now() / 1000);
            const expiresInSeconds = exp - now;

            if (expiresInSeconds > 0) {
                await this.redisClient.set(`blacklist:${token}`, 'true', {
                    EX: expiresInSeconds + 30
                });
            }

            await this.supabaseClient.auth.admin.signOut(userId);

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
