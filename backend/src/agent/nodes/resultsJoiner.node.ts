import { NodeFactory } from './types';

/**
 * Nodo de sincronización entre las ramas paralelas relationalDBQuery y
 * vectorDBQuery. No transforma estado; existe para unir el fork antes de la
 * decisión de "¿hay candidatos?".
 */
export const resultsJoinerNode: NodeFactory = () => () => {
  return {};
};
