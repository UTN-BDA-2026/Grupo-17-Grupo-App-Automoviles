import { Logger } from '@nestjs/common';
import { NodeFactory } from './types';
import { HardFilters } from '../schemas/hardFilters.schema';

const logger = new Logger('filterValidator');

/** Cuenta cuántos campos de filtros duros tienen valor no nulo. */
function countHardFilters(filters: HardFilters): number {
  return Object.values(filters).filter((v) => v !== null && v !== undefined)
    .length;
}

/**
 * Nodo puro: decide si los criterios alcanzan para buscar o si hace falta pedir
 * aclaración. Suficiente si: 2+ filtros duros, o 1 filtro duro + propósito, o
 * propósito + perfil del usuario.
 */
export const filterValidatorNode: NodeFactory = () => (state) => {
  const hardCount = countHardFilters(state.hardFilters);
  const hasPurpose = !!state.softCriteria.purpose?.trim();
  const hasProfile = !!state.softCriteria.userProfile?.trim();

  const sufficient =
    hardCount >= 2 ||
    (hardCount >= 1 && hasPurpose) ||
    (hasPurpose && hasProfile);

  logger.debug(
    `hardCount=${hardCount} hasPurpose=${hasPurpose} hasProfile=${hasProfile} sufficient=${sufficient}`,
  );

  return { needsClarification: !sufficient };
};
