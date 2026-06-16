import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({
    description: 'Texto del mensaje del usuario para el agente recomendador',
    example: 'Quiero un auto nafta hasta 20 millones para la ciudad',
    maxLength: 4000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  content!: string;
}
