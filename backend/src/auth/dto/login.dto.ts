import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@ejemplo.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'El email no es válido' })
  email!: string;

  @ApiProperty({ description: 'Contraseña del usuario', example: 'MiClaveSegura1' })
  @IsString()
  password!: string;
}
