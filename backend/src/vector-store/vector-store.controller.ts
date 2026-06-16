import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { RecommendationManualService } from './services/recommendation-manual.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('vector-store (admin)')
@ApiBearerAuth('jwt')
@ApiUnauthorizedResponse({ description: 'Token no provisto, inválido o expirado.' })
@ApiForbiddenResponse({ description: 'Requiere rol Admin.' })
@Controller('api/admin/vector')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class VectorStoreController {
  constructor(private readonly manualService: RecommendationManualService) {}

  @Post('sync')
  @ApiOperation({
    summary: 'Sincronizar el manual de recomendación',
    description:
      'Re-ingesta el manual experto en ChromaDB (regenera embeddings y reemplaza la colección). Solo Admin.',
  })
  @ApiCreatedResponse({ description: 'Sincronización completada; devuelve la cantidad de chunks.' })
  public sync() {
    return this.manualService.sync();
  }

  @Get('count')
  @ApiOperation({
    summary: 'Contar chunks almacenados',
    description: 'Devuelve la cantidad de chunks del manual en la base vectorial. Solo Admin.',
  })
  @ApiOkResponse({ description: 'Cantidad de chunks.' })
  public count() {
    return this.manualService.count();
  }
}
