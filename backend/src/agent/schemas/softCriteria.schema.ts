import { z } from 'zod';

/**
 * Prioridades de equipamiento descritas en lenguaje natural. Cada dimensión
 * espeja una clave de IEquipment. Alimentan la búsqueda vectorial de reglas.
 */
export const prioritiesSchema = z.object({
  security: z
    .string()
    .nullable()
    .describe(
      'Qué le importa al usuario en seguridad (ABS, airbags, cámara, etc.)',
    ),
  confort: z
    .string()
    .nullable()
    .describe(
      'Preferencias de confort (climatizador, vidrios eléctricos, etc.)',
    ),
  interior: z
    .string()
    .nullable()
    .describe('Preferencias de interior (tapizado de cuero, etc.)'),
  exterior: z
    .string()
    .nullable()
    .describe(
      'Preferencias de exterior (llantas de aleación, techo solar, etc.)',
    ),
  entertainment: z
    .string()
    .nullable()
    .describe('Preferencias de entretenimiento (Bluetooth, USB, etc.)'),
  warranty: z
    .string()
    .nullable()
    .describe('Preferencias de garantía y condiciones de compra'),
  performance: z
    .string()
    .nullable()
    .describe('Preferencias de performance (potencia, dimensiones, etc.)'),
  other_features: z
    .string()
    .nullable()
    .describe('Otras características relevantes mencionadas'),
});

/**
 * Criterios "blandos": no mapean a columnas, describen al usuario y su intención.
 */
export const softCriteriaSchema = z.object({
  purpose: z
    .string()
    .nullable()
    .describe('Uso pretendido del vehículo (ciudad, ruta, trabajo, etc.)'),
  userProfile: z
    .string()
    .nullable()
    .describe('Perfil del usuario (familia, soltero, adulto mayor, etc.)'),
  priorities: prioritiesSchema,
});

export type Priorities = z.infer<typeof prioritiesSchema>;
export type SoftCriteria = z.infer<typeof softCriteriaSchema>;

/** Criterios blandos vacíos. */
export const emptySoftCriteria = (): SoftCriteria => ({
  purpose: null,
  userProfile: null,
  priorities: {
    security: null,
    confort: null,
    interior: null,
    exterior: null,
    entertainment: null,
    warranty: null,
    performance: null,
    other_features: null,
  },
});
