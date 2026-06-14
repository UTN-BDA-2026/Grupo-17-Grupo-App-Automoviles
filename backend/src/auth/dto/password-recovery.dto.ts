import { IsEmail } from 'class-validator';

export class PasswordRecoveryDto {
    @IsEmail({}, { message: 'El email no es válido' })
    email!: string;
}
