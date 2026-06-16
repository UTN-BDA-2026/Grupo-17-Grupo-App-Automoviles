import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ListingService } from './services/listing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('productos')
@ApiBearerAuth('jwt')
@ApiUnauthorizedResponse({ description: 'Token no provisto, inválido o expirado.' })
@Controller('api/products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly listingService: ListingService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar publicaciones de vehículos',
    description: 'Devuelve las publicaciones (listings) paginadas, con vehículo, modelo, marca y link.',
  })
  @ApiQuery({ name: 'pageNumber', required: false, type: Number, example: 1, description: 'Número de página (default 1).' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 20, description: 'Tamaño de página (default 20).' })
  @ApiOkResponse({ description: 'Listado paginado de publicaciones.' })
  public async get(
    @Query('pageNumber', new DefaultValuePipe(1), ParseIntPipe) pageNumber: number,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize: number,
  ) {
    const result = this.listingService.get(pageNumber, pageSize);
    return result;
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Obtener una publicación por id',
    description: 'Devuelve la publicación con sus relaciones (vehículo, modelo, marca, link).',
  })
  @ApiParam({ name: 'id', description: 'Id de la publicación (UUID)', format: 'uuid' })
  @ApiOkResponse({ description: 'Publicación encontrada.' })
  @ApiNotFoundResponse({ description: 'La publicación no existe.' })
  public async getById(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 400 })) id: string,
  ) {
    const result = this.listingService.getById(id);
    return result;
  }
}
