import { Logger } from '@nestjs/common';
import { NodeFactory } from './types';
import { ListingFilterDTO } from '../../products/dto/listing-filter.dto';
import { HardFilters } from '../schemas/hardFilters.schema';

const logger = new Logger('relationalDBQuery');

/** Mapea filtros duros (no nulos) al DTO de filtrado del servicio de listings. */
function toFilterDTO(f: HardFilters): ListingFilterDTO {
  const dto: ListingFilterDTO = {};
  if (f.minPrice != null) dto.minPrice = f.minPrice;
  if (f.maxPrice != null) dto.maxPrice = f.maxPrice;
  if (f.minMileage != null) dto.minMileage = f.minMileage;
  if (f.maxMileage != null) dto.maxMileage = f.maxMileage;
  if (f.minYear != null) dto.minYear = f.minYear;
  if (f.maxYear != null) dto.maxYear = f.maxYear;
  if (f.brand != null) dto.brand = f.brand;
  if (f.model != null) dto.model = f.model;
  if (f.fuelType != null) dto.fuelType = f.fuelType;
  if (f.transmission != null) dto.transmission = f.transmission;
  if (f.doors != null) dto.doors = f.doors;
  if (f.engine != null) dto.engine = f.engine;
  if (f.bodyType != null) dto.bodyType = f.bodyType;
  if (f.condition != null) dto.condition = f.condition;
  if (f.tractionControl != null) dto.tractionControl = f.tractionControl;
  return dto;
}

/**
 * Consulta la base relacional reutilizando ListingService.filter (NO accede al
 * ORM directamente). Devuelve hasta AGENT_RELATIONAL_TOP_K candidatos.
 */
export const relationalDBQueryNode: NodeFactory = (deps) => async (state) => {
  const topK = parseInt(
    deps.config.get<string>('AGENT_RELATIONAL_TOP_K') ?? '20',
    10,
  );
  const dto = toFilterDTO(state.hardFilters);

  const candidates = await deps.listingService.filter(dto, topK);
  logger.debug(`Candidatos relacionales encontrados: ${candidates.length}`);

  return { candidateVehicles: candidates };
};
