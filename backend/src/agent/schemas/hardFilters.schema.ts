import { z } from 'zod';

/**
 * Filtros "duros": criterios mapeables directamente a columnas de la base
 * relacional (listings + vehicle/model/brand). Todos los campos son nullable:
 * un valor null significa "el usuario no lo especificó / lo retiró".
 */
export const hardFiltersSchema = z.object({
  minPrice: z.number().nullable().describe('Precio mínimo en la moneda local'),
  maxPrice: z.number().nullable().describe('Precio máximo en la moneda local'),
  minMileage: z.number().nullable().describe('Kilometraje mínimo'),
  maxMileage: z.number().nullable().describe('Kilometraje máximo'),
  minYear: z.number().nullable().describe('Año mínimo del vehículo'),
  maxYear: z.number().nullable().describe('Año máximo del vehículo'),
  brand: z.string().nullable().describe('Marca, ej. Ford, Toyota'),
  model: z.string().nullable().describe('Modelo, ej. Ka, Corolla'),
  fuelType: z
    .string()
    .nullable()
    .describe('Tipo de combustible: Nafta, Diésel, GNC, Híbrido, Eléctrico'),
  transmission: z
    .string()
    .nullable()
    .describe('Transmisión: Manual o Automática'),
  doors: z.number().nullable().describe('Cantidad de puertas'),
  engine: z.string().nullable().describe('Cilindrada del motor, ej. 1.5, 2.0'),
  bodyType: z
    .string()
    .nullable()
    .describe('Carrocería: Sedán, Hatchback, SUV, Pickup, etc.'),
  condition: z.string().nullable().describe('Condición: Nuevo o Usado'),
  tractionControl: z
    .string()
    .nullable()
    .describe('Tracción: Delantera, Trasera, 4x4'),
});

export type HardFilters = z.infer<typeof hardFiltersSchema>;

/** Filtros duros vacíos (todos los campos en null). */
export const emptyHardFilters = (): HardFilters => ({
  minPrice: null,
  maxPrice: null,
  minMileage: null,
  maxMileage: null,
  minYear: null,
  maxYear: null,
  brand: null,
  model: null,
  fuelType: null,
  transmission: null,
  doors: null,
  engine: null,
  bodyType: null,
  condition: null,
  tractionControl: null,
});
