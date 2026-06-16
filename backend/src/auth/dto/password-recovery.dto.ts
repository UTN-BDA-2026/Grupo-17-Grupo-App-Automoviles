import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordRecoveryDto {
  @ApiProperty({
    description: 'Email al que se enviará el correo de recuperación',
    example: 'usuario@ejemplo.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'El email no es válido' })
  email!: string;
}
