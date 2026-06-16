import { IsObject, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'Preferencias del usuario (objeto libre)',
    type: 'object',
    additionalProperties: true,
    example: { tema: 'oscuro', idioma: 'es' },
  })
  @IsObject()
  @IsOptional()
  preferences?: Record<string, any>;
}
