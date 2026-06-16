import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshDto {
  @ApiProperty({
    description: 'Refresh token obtenido en el login',
    example: 'v1.MmYy...',
  })
  @IsString()
  refreshToken!: string;
}
